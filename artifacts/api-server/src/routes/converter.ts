import { Router, type IRouter, type Request, type Response } from "express";
import { GetVideoInfoBody, GetVideoInfoResponse, ConvertVideoBody, ConvertVideoResponse } from "@workspace/api-zod";
import { create as createYtDlp } from "yt-dlp-exec";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const YT_DLP_BINARY = "/nix/store/39bpsx6xv7qrcnnbv65zmh8sabqdyl49-yt-dlp-2024.12.23/bin/yt-dlp";
const ytDlp = createYtDlp(YT_DLP_BINARY);

const router: IRouter = Router();

const DOWNLOADS_DIR = path.join(process.cwd(), "downloads");

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

function isValidYouTubeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");
    return host === "youtube.com" || host === "youtu.be";
  } catch {
    return false;
  }
}

function extractVideoId(url: string): string {
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

async function fetchVideoInfo(url: string): Promise<{ title: string; thumbnail: string; duration: number }> {
  const videoId = extractVideoId(url);

  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const oembedRes = await fetch(oembedUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)" },
  });

  let title = "Unknown Title";
  let thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";

  if (oembedRes.ok) {
    const data = await oembedRes.json() as any;
    title = data.title || title;
    thumbnail = data.thumbnail_url || thumbnail;
  }

  let duration = 0;
  try {
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const match = html.match(/"lengthSeconds":"(\d+)"/);
      if (match) {
        duration = parseInt(match[1], 10);
      }
    }
  } catch {
  }

  return { title, thumbnail, duration };
}

router.post("/info", async (req: Request, res: Response) => {
  try {
    const parsed = GetVideoInfoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { url } = parsed.data;
    if (!isValidYouTubeUrl(url)) {
      res.status(400).json({ error: "Invalid YouTube URL. Only youtube.com and youtu.be are allowed." });
      return;
    }

    const { title, thumbnail, duration } = await fetchVideoInfo(url);

    if (duration > 1200) {
      res.status(400).json({ error: "Video too long. Maximum duration is 20 minutes." });
      return;
    }

    const response = GetVideoInfoResponse.parse({ title, thumbnail, duration });
    res.json(response);
  } catch (err: any) {
    console.error("Info error:", err.message);
    res.status(400).json({ error: "Failed to fetch video info. Make sure the URL is a valid public YouTube video." });
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

    if (!isValidYouTubeUrl(url)) {
      res.status(400).json({ error: "Invalid YouTube URL. Only youtube.com and youtu.be are allowed." });
      return;
    }

    const urlKey = crypto.createHash("md5").update(url + quality).digest("hex");
    if (inProgressConversions.has(urlKey)) {
      res.status(400).json({ error: "This video is already being converted. Please wait." });
      return;
    }

    const existingMp3 = path.join(DOWNLOADS_DIR, `${urlKey}.mp3`);
    if (fs.existsSync(existingMp3)) {
      const metaFile = path.join(DOWNLOADS_DIR, `${urlKey}.json`);
      let title = "Audio";
      if (fs.existsSync(metaFile)) {
        try { title = JSON.parse(fs.readFileSync(metaFile, "utf-8")).title || title; } catch {}
      }
      const response = ConvertVideoResponse.parse({ success: true, title, download: `/api/downloads/${urlKey}.mp3` });
      res.json(response);
      return;
    }

    inProgressConversions.add(urlKey);

    try {
      const { title, duration } = await fetchVideoInfo(url);

      if (duration > 1200) {
        res.status(400).json({ error: "Video too long. Maximum duration is 20 minutes." });
        return;
      }

      const tempAudio = path.join(DOWNLOADS_DIR, `${urlKey}.%(ext)s`);
      const outputMp3 = path.join(DOWNLOADS_DIR, `${urlKey}.mp3`);

      await (ytDlp as any)(url, {
        format: "bestaudio/best",
        output: tempAudio,
        noWarnings: true,
        noCheckCertificate: true,
        extractorArgs: "youtube:player_client=web_creator",
        addHeaders: [
          "User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        ],
      });

      const downloadedFiles = fs.readdirSync(DOWNLOADS_DIR).filter(f => f.startsWith(urlKey) && !f.endsWith(".mp3") && !f.endsWith(".json"));
      const downloadedFile = downloadedFiles[0] ? path.join(DOWNLOADS_DIR, downloadedFiles[0]) : null;

      if (!downloadedFile || !fs.existsSync(downloadedFile)) {
        res.status(500).json({ error: "Download failed. Please try again." });
        return;
      }

      await new Promise<void>((resolve, reject) => {
        ffmpeg(downloadedFile)
          .audioBitrate(parseInt(quality))
          .toFormat("mp3")
          .on("end", () => resolve())
          .on("error", (err: Error) => reject(err))
          .save(outputMp3);
      });

      if (fs.existsSync(downloadedFile)) fs.unlinkSync(downloadedFile);

      const metaFile = path.join(DOWNLOADS_DIR, `${urlKey}.json`);
      fs.writeFileSync(metaFile, JSON.stringify({ title, createdAt: Date.now() }));

      const response = ConvertVideoResponse.parse({
        success: true,
        title,
        download: `/api/downloads/${urlKey}.mp3`,
      });

      res.json(response);
    } finally {
      inProgressConversions.delete(urlKey);
    }
  } catch (err: any) {
    console.error("Convert error:", err.message);
    if (err.message?.includes("Sign in") || err.message?.includes("Precondition") || err.message?.includes("400")) {
      res.status(500).json({ error: "YouTube requires authentication for downloads from this server. Please try again or try a different video." });
    } else {
      res.status(500).json({ error: "Conversion failed. Please try again with a different video." });
    }
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
