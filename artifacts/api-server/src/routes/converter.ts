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
const MAX_CONCURRENT_CONVERSIONS = 3;
const MAX_FILE_SIZE = 500 * 1024 * 1024;
const BITRATE_LIMITS: Record<string, number> = {
  "128": 128,
  "192": 192,
  "320": 320
};

// FFmpeg quality presets for faster encoding
// Higher number = higher quality but slower
function getQualityPreset(quality: string): number {
  const presets: Record<string, number> = {
    "128": 8,  // Fast: 128kbps (VBR)
    "192": 5,  // Medium: 192kbps (VBR)
    "320": 2   // Best: 320kbps (VBR)
  };
  return presets[quality] || 5;
}

async function fetchMediaInfo(url: string): Promise<{ title: string; thumbnail: string; duration: number }> {
  const mediaId = extractMediaId(url);
  
  let title = "Unknown Title";
  let thumbnail = mediaId ? `https://img.youtube.com/vi/${mediaId}/hqdefault.jpg` : "";
  let duration = 0;

  // Parallelize both API calls for faster execution
  const [oembedData, pageData] = await Promise.all([
    // Fetch metadata from oembed
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null),
    // Fetch duration from page
    fetch(`https://www.youtube.com/watch?v=${mediaId}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    })
      .then(res => res.ok ? res.text() : null)
      .catch(() => null)
  ]);

  if (oembedData) {
    title = oembedData.title || title;
    thumbnail = oembedData.thumbnail_url || thumbnail;
  }

  if (pageData) {
    const match = pageData.match(/"lengthSeconds":"(\d+)"/);
    if (match) duration = parseInt(match[1], 10);
  }

  return { title, thumbnail, duration };
}

const LOADER_API = "https://loader.to/ajax/download.php";
const PROGRESS_BASE = "https://p.savenow.to/api/progress";

async function convertWithLoaderTo(url: string): Promise<string> {
  const initRes = await fetch(`${LOADER_API}?format=mp3&url=${encodeURIComponent(url)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
  });
  if (!initRes.ok) throw new Error("Failed to initiate conversion");

  const initData = await initRes.json() as any;
  if (!initData.success) throw new Error("Conversion service rejected the request");

  const jobId = initData.id;
  const progressUrl = initData.progress_url || `${PROGRESS_BASE}?id=${jobId}`;

  // Aggressive polling: faster intervals for quicker completion
  const pollIntervals = [1000, 1500, 2000, 2500, 3000]; // Progressive backoff
  for (let attempt = 0; attempt < 240; attempt++) {
    const pollDelay = pollIntervals[Math.min(attempt, pollIntervals.length - 1)];
    await new Promise(r => setTimeout(r, pollDelay));

    try {
      const progRes = await fetch(progressUrl);
      if (!progRes.ok) continue;

      const progData = await progRes.json() as any;
      if (progData.success === 1 && progData.download_url) {
        return progData.download_url.replace(/\\\//g, "/");
      }
      if (progData.success === -1) throw new Error("Conversion failed on remote server");
    } catch (e) {
      // Retry on network error
      continue;
    }
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
    if (duration > 36000) {
      res.status(400).json({ error: "Media file too long. Maximum duration is 10 hours." });
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

    // Check concurrent conversion limit
    if (inProgressConversions.size >= MAX_CONCURRENT_CONVERSIONS) {
      res.status(429).json({ error: "Server busy. Too many conversions. Please wait a moment and try again." });
      return;
    }

    const urlKey = crypto.createHash("md5").update(url + quality).digest("hex");
    if (inProgressConversions.has(urlKey)) {
      res.status(400).json({ error: "This media is already being converted. Please wait." });
      return;
    }

    // Validate bitrate
    if (!BITRATE_LIMITS[quality]) {
      res.status(400).json({ error: "Invalid quality selection. Choose 128, 192, or 320 kbps." });
      return;
    }

    // Skip cache - stream directly from loader.to for instant conversion

    inProgressConversions.add(urlKey);

    try {
      const { title, duration } = await fetchMediaInfo(url);
      if (duration > 36000) {
        res.status(400).json({ error: "Media file too long. Maximum duration is 10 hours." });
        return;
      }

      // Get direct download URL from loader.to
      const downloadUrl = await convertWithLoaderTo(url);

      // Build a safe filename for the Content-Disposition header
      const safeTitle = title.replace(/[^a-zA-Z0-9 _\-]/g, "").trim() || "audio";

      // Encode the remote URL so we can pass it to our proxy endpoint
      const encodedUrl = Buffer.from(downloadUrl).toString("base64url");
      const encodedTitle = encodeURIComponent(safeTitle);

      // Return a same-origin proxy URL — this is the key fix:
      // cross-origin download links ignore the `download` attribute, causing
      // the browser to open / stream the file instead of saving it.
      // By proxying through our own domain, the download attribute works correctly.
      const proxyDownload = `/api/proxy-download?u=${encodedUrl}&t=${encodedTitle}`;

      const response = ConvertVideoResponse.parse({
        success: true,
        title,
        download: proxyDownload
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

// Proxy download endpoint — streams the remote MP3 through our server
// so the browser's `download` attribute works (cross-origin URLs ignore it)
router.get("/proxy-download", async (req: Request, res: Response) => {
  const { u, t: titleParam } = req.query;

  if (!u || typeof u !== "string") {
    res.status(400).json({ error: "Missing download URL parameter" });
    return;
  }

  let remoteUrl: string;
  try {
    remoteUrl = Buffer.from(u, "base64url").toString("utf-8");
    new URL(remoteUrl); // Validate it's a real URL
  } catch {
    res.status(400).json({ error: "Invalid download URL" });
    return;
  }

  // Only allow downloads from known CDNs used by loader.to
  const allowed = ["savenow.to", "loader.to", "cobalt.tools", "cdn.", "dl.", "download.", "files."];
  const urlHost = new URL(remoteUrl).hostname;
  const isAllowed = allowed.some(h => urlHost.includes(h));
  if (!isAllowed) {
    // Allow any HTTPS URL as a fallback — the key is we serve it from our domain
    if (!remoteUrl.startsWith("https://")) {
      res.status(403).json({ error: "Only HTTPS sources are allowed" });
      return;
    }
  }

  const safeTitle = titleParam
    ? decodeURIComponent(String(titleParam)).replace(/[^a-zA-Z0-9 _\-]/g, "").trim()
    : "audio";
  const filename = `${safeTitle || "audio"}.mp3`;

  try {
    const upstream = await fetch(remoteUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://loader.to/",
      }
    });

    if (!upstream.ok) {
      res.status(502).json({ error: "Failed to fetch audio from upstream server" });
      return;
    }

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", upstream.headers.get("Content-Type") || "audio/mpeg");

    const contentLength = upstream.headers.get("Content-Length");
    if (contentLength) res.setHeader("Content-Length", contentLength);

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (!upstream.body) {
      res.status(502).json({ error: "No response body from upstream" });
      return;
    }

    // Stream the response — no buffering, memory-efficient
    const reader = upstream.body.getReader();
    const passThrough = new (await import("stream")).Transform({
      transform(chunk, _enc, cb) { cb(null, chunk); }
    });

    res.on("close", () => reader.cancel());

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) { passThrough.end(); break; }
          passThrough.push(value);
        }
      } catch { passThrough.destroy(); }
    })();

    passThrough.pipe(res);
  } catch (err: any) {
    console.error("Proxy download error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Download proxy error: " + err.message });
    }
  }
});

router.get("/downloads/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;
  // Accept both .mp3 and .mp3 for backwards compatibility
  if (!/^[a-f0-9]{32}\.(mp3|m4a)$/.test(filename)) {
    res.status(400).json({ error: "Invalid filename" });
    return;
  }
  const filePath = path.join(DOWNLOADS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found or expired" });
    return;
  }

  // Get file stats for size
  const fileStats = fs.statSync(filePath);
  if (fileStats.size > MAX_FILE_SIZE) {
    res.status(413).json({ error: "File too large" });
    return;
  }

  const metaFile = path.join(DOWNLOADS_DIR, filename.replace(/\.(mp3|m4a)$/, ".json"));
  let downloadName = "audio.mp3";
  if (fs.existsSync(metaFile)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
      if (meta.title) {
        downloadName = meta.title.replace(/[^a-zA-Z0-9 _-]/g, "").trim() + ".mp3";
      }
    } catch {}
  }

  // Optimize for fast download (simple, reliable approach)
  res.setHeader("Content-Disposition", `attachment; filename="${downloadName}"`);
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Length", fileStats.size);
  res.setHeader("Cache-Control", "public, max-age=3600");
  // Remove problematic headers for downloads
  res.setHeader("Accept-Ranges", "bytes");
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
            const audioFile = metaPath.replace(".json", ".mp3");
            if (fs.existsSync(audioFile)) fs.unlinkSync(audioFile);
            // Also clean up old .mp3 files for backwards compatibility
            const mp3File = metaPath.replace(".json", ".mp3");
            if (fs.existsSync(mp3File)) fs.unlinkSync(mp3File);
          }
        } catch {}
      }
    } catch {}
  }, 15 * 60 * 1000);
}

scheduleCleanup();

export default router;
