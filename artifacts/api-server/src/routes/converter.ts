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

const inProgressConversions = new Set<string>();

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

    const info = await (ytDlp as any)(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      extractorArgs: "youtube:player_client=ios,mweb",
    }) as any;

    const duration = info.duration as number || 0;
    if (duration > 1200) {
      res.status(400).json({ error: "Video too long. Maximum duration is 20 minutes." });
      return;
    }

    const thumbnail = info.thumbnail as string || `https://img.youtube.com/vi/${extractVideoId(url)}/maxresdefault.jpg`;

    const response = GetVideoInfoResponse.parse({
      title: info.title as string || "Unknown Title",
      thumbnail,
      duration,
    });

    res.json(response);
  } catch (err: any) {
    console.error("Info error:", err.message);
    if (err.message?.includes("Precondition") || err.message?.includes("400") || err.message?.includes("Requested format")) {
      res.status(400).json({ error: "YouTube is currently restricting access from this server. To use this app, please deploy it to your own server or use a VPN/proxy configuration." });
    } else {
      res.status(400).json({ error: "Failed to fetch video info. Make sure the URL is a valid public YouTube video." });
    }
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

    const existingFile = path.join(DOWNLOADS_DIR, `${urlKey}.mp3`);
    if (fs.existsSync(existingFile)) {
      const metaFile = path.join(DOWNLOADS_DIR, `${urlKey}.json`);
      let title = "Audio";
      if (fs.existsSync(metaFile)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
          title = meta.title || title;
        } catch {}
      }
      const response = ConvertVideoResponse.parse({
        success: true,
        title,
        download: `/api/downloads/${urlKey}.mp3`,
      });
      res.json(response);
      return;
    }

    inProgressConversions.add(urlKey);

    try {
      const info = await (ytDlp as any)(url, {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificate: true,
        extractorArgs: "youtube:player_client=ios,mweb",
      }) as any;

      const duration = info.duration as number || 0;
      if (duration > 1200) {
        res.status(400).json({ error: "Video too long. Maximum duration is 20 minutes." });
        inProgressConversions.delete(urlKey);
        return;
      }

      const title = (info.title as string) || "Audio";
      const tempFile = path.join(DOWNLOADS_DIR, `${urlKey}.webm`);
      const outputFile = path.join(DOWNLOADS_DIR, `${urlKey}.mp3`);

      await (ytDlp as any)(url, {
        format: "bestaudio",
        output: tempFile,
        noWarnings: true,
        noCheckCertificate: true,
      });

      await new Promise<void>((resolve, reject) => {
        ffmpeg(tempFile)
          .audioBitrate(parseInt(quality))
          .toFormat("mp3")
          .on("end", () => resolve())
          .on("error", (err: Error) => reject(err))
          .save(outputFile);
      });

      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }

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
    res.status(500).json({ error: "Conversion failed. Please try again with a different video." });
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

function extractVideoId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }
    return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

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
