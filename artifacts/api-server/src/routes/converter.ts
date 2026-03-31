import { Router, type IRouter, type Request, type Response } from "express";
import { GetVideoInfoBody, GetVideoInfoResponse, ConvertVideoBody, ConvertVideoResponse } from "@workspace/api-zod";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

const router: IRouter = Router();

const DOWNLOADS_DIR = path.join(process.cwd(), "downloads");

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

function isValidMediaUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname || '';
    // Check if hostname contains any valid media platform
    return hostname.includes('youtube.com') || 
           hostname.includes('youtu.be') || 
           hostname.includes('vimeo.com') || 
           hostname.includes('instagram.com') || 
           hostname.includes('tiktok.com') || 
           hostname.includes('facebook.com') || 
           hostname.includes('twitter.com') || 
           hostname.includes('x.com');
  } catch {
    return false;
  }
}

function extractMediaId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("?")[0];
    }
    return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

const inProgressConversions = new Set<string>();

async function fetchMediaInfo(url: string): Promise<{ title: string; thumbnail: string; duration: number }> {
  const mediaId = extractMediaId(url);
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

  let title = "Unknown Title";
  let thumbnail = mediaId ? `https://img.youtube.com/vi/${mediaId}/hqdefault.jpg` : "";

  try {
    const oembedRes = await fetch(oembedUrl);
    if (oembedRes.ok) {
      const data = await oembedRes.json() as any;
      title = data.title || title;
      thumbnail = data.thumbnail_url || thumbnail;
    }
  } catch {}

  let duration = 0;
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${mediaId}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" },
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const match = html.match(/"lengthSeconds":"(\d+)"/);
      if (match) duration = parseInt(match[1], 10);
    }
  } catch {}

  return { title, thumbnail, duration };
}

const LOADER_API = "https://loader.to/ajax/download.php";
const PROGRESS_BASE = "https://p.savenow.to/api/progress";

async function convertWithLoaderTo(url: string): Promise<string> {
  const initRes = await fetch(`${LOADER_API}?format=mp3&url=${encodeURIComponent(url)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" },
  });
  if (!initRes.ok) throw new Error("Failed to initiate conversion");

  const initData = await initRes.json() as any;
  if (!initData.success) throw new Error("Conversion service rejected the request");

  const jobId = initData.id;
  const progressUrl = initData.progress_url || `${PROGRESS_BASE}?id=${jobId}`;

  for (let attempt = 0; attempt < 240; attempt++) {
    await new Promise(r => setTimeout(r, 3000));

    const progRes = await fetch(progressUrl);
    if (!progRes.ok) continue;

    const progData = await progRes.json() as any;
    if (progData.success === 1 && progData.download_url) {
      return progData.download_url.replace(/\\\//g, "/");
    }
    if (progData.success === -1) throw new Error("Conversion failed on remote server");
  }

  throw new Error("Conversion timed out after 12 minutes");
}

router.post("/info", async (req: Request, res: Response) => {
  try {
    const parsed = GetVideoInfoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { url } = parsed.data;
    if (!isValidMediaUrl(url)) {
      res.status(400).json({ error: "Invalid media URL. Please provide a valid media source link." });
      return;
    }

    const { title, thumbnail, duration } = await fetchMediaInfo(url);
    if (duration > 1200) {
      res.status(400).json({ error: "Media file too long. Maximum duration is 20 minutes." });
      return;
    }

    const response = GetVideoInfoResponse.parse({ title, thumbnail, duration });
    res.json(response);
  } catch (err: any) {
    console.error("Info error:", err.message);
    res.status(400).json({ error: "Failed to fetch media info. Please ensure the URL is valid and publicly accessible." });
  }
});

router.post("/convert", async (req: Request, res: Response) => {
  try {
    const parsed = ConvertVideoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { url, quality } = parsed.data;

    if (!isValidMediaUrl(url)) {
      res.status(400).json({ error: "Invalid media URL. Please provide a valid media source link." });
      return;
    }

    const urlKey = crypto.createHash("md5").update(url + quality).digest("hex");
    if (inProgressConversions.has(urlKey)) {
      res.status(400).json({ error: "This media is already being converted. Please wait." });
      return;
    }

    const existingMp3 = path.join(DOWNLOADS_DIR, `${urlKey}.m4a`);
    if (fs.existsSync(existingMp3)) {
      const metaFile = path.join(DOWNLOADS_DIR, `${urlKey}.json`);
      let title = "Audio";
      if (fs.existsSync(metaFile)) {
        try { title = JSON.parse(fs.readFileSync(metaFile, "utf-8")).title || title; } catch {}
      }
      const response = ConvertVideoResponse.parse({ success: true, title, download: `/api/downloads/${urlKey}.m4a` });
      res.json(response);
      return;
    }

    inProgressConversions.add(urlKey);

    try {
      const { title, duration } = await fetchMediaInfo(url);
      if (duration > 1200) {
        res.status(400).json({ error: "Media file too long. Maximum duration is 20 minutes." });
        return;
      }

      const downloadUrl = await convertWithLoaderTo(url);

      const sourceMp3 = path.join(DOWNLOADS_DIR, `${urlKey}_source.m4a`);
      const outputMp3 = path.join(DOWNLOADS_DIR, `${urlKey}.m4a`);

      const dlRes = await fetch(downloadUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" },
      });
      if (!dlRes.ok || !dlRes.body) throw new Error("Failed to download converted audio");

      const fileStream = fs.createWriteStream(sourceMp3);
      await pipeline(Readable.fromWeb(dlRes.body as any), fileStream);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(sourceMp3)
          .audioBitrate(parseInt(quality))
          .toFormat("m4a")
          .on("end", () => resolve())
          .on("error", (e: Error) => reject(e))
          .save(outputMp3);
      });

      if (fs.existsSync(sourceMp3)) fs.unlinkSync(sourceMp3);

      fs.writeFileSync(
        path.join(DOWNLOADS_DIR, `${urlKey}.json`),
        JSON.stringify({ title, createdAt: Date.now() })
      );

      const response = ConvertVideoResponse.parse({
        success: true,
        title,
        download: `/api/downloads/${urlKey}.m4a`,
      });
      res.json(response);
    } finally {
      inProgressConversions.delete(urlKey);
    }
  } catch (err: any) {
    console.error("Convert error:", err.message);
    res.status(500).json({ error: "Conversion failed: " + (err.message || "Please try again.") });
  }
});

router.get("/downloads/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;
  if (!/^[a-f0-9]{32}\.mp3$/.test(filename)) {
    res.status(400).json({ error: "Invalid filename" });
    return;
  }
  const filePath = path.join(DOWNLOADS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found or expired" });
    return;
  }
  const metaFile = path.join(DOWNLOADS_DIR, filename.replace(".mp3", ".json"));
  let downloadName = "audio.mp3";
  if (fs.existsSync(metaFile)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
      if (meta.title) {
        downloadName = meta.title.replace(/[^a-zA-Z0-9 _-]/g, "").trim() + ".mp3";
      }
    } catch {}
  }
  res.setHeader("Content-Disposition", `attachment; filename="${downloadName}"`);
  res.setHeader("Content-Type", "audio/mpeg");
  res.sendFile(filePath);
});

function scheduleCleanup() {
  const ONE_HOUR = 60 * 60 * 1000;
  setInterval(() => {
    try {
      const files = fs.readdirSync(DOWNLOADS_DIR);
      const now = Date.now();
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        const metaPath = path.join(DOWNLOADS_DIR, file);
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
          if (now - meta.createdAt > ONE_HOUR) {
            fs.unlinkSync(metaPath);
            const mp3 = metaPath.replace(".json", ".mp3");
            if (fs.existsSync(mp3)) fs.unlinkSync(mp3);
          }
        } catch {}
      }
    } catch {}
  }, 15 * 60 * 1000);
}

scheduleCleanup();

export default router;
