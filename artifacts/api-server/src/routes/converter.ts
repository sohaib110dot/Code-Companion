import { Router, type IRouter, type Request, type Response } from "express";
import { GetVideoInfoBody, GetVideoInfoResponse, ConvertVideoBody, ConvertVideoResponse } from "@workspace/api-zod";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const router: IRouter = Router();

// ─── Constants ────────────────────────────────────────────────────────────────
const TEMP_DIR = path.join(process.cwd(), "downloads");
const MAX_CONCURRENT = 5;
const MAX_DURATION_SECONDS = 10 * 60 * 60;

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const QUALITY_MAP: Record<string, string> = { "128": "5", "192": "2", "320": "0" };

// ─── URL Validation ───────────────────────────────────────────────────────────
function isValidMediaUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

// ─── yt-dlp availability check ───────────────────────────────────────────────
let ytDlpAvailable: boolean | null = null;

async function checkYtDlp(): Promise<boolean> {
  if (ytDlpAvailable !== null) return ytDlpAvailable;
  return new Promise((resolve) => {
    const proc = spawn("yt-dlp", ["--version"]);
    proc.on("close", (code) => {
      ytDlpAvailable = code === 0;
      console.log(ytDlpAvailable ? "[yt-dlp] ✅ Available" : "[yt-dlp] ⚠️ Not found");
      resolve(ytDlpAvailable!);
    });
    proc.on("error", () => { ytDlpAvailable = false; resolve(false); });
  });
}

// ─── yt-dlp: Fetch video info ─────────────────────────────────────────────────
async function ytDlpGetInfo(url: string): Promise<{ title: string; thumbnail: string; duration: number }> {
  return new Promise((resolve, reject) => {
    let json = "";
    const proc = spawn("yt-dlp", [
      url,
      "--dump-json",
      "--no-download",
      "--no-playlist",
      "--no-warnings",
      "--quiet",
      "--extractor-args", "youtube:player_client=tv_embedded",
    ]);
    proc.stdout.on("data", (d: Buffer) => { json += d.toString(); });
    proc.on("close", (code) => {
      if (code !== 0) { reject(new Error("yt-dlp info failed")); return; }
      try {
        const info = JSON.parse(json.trim());
        resolve({
          title: info.title || "Unknown",
          thumbnail: info.thumbnail || info.thumbnails?.[0]?.url || "",
          duration: info.duration || 0,
        });
      } catch { reject(new Error("Failed to parse yt-dlp JSON")); }
    });
    proc.on("error", reject);
    setTimeout(() => { proc.kill(); reject(new Error("yt-dlp info timeout")); }, 30_000);
  });
}

// ─── Fallback: YouTube oEmbed info ───────────────────────────────────────────
async function youtubeOembedInfo(url: string): Promise<{ title: string; thumbnail: string; duration: number }> {
  const parsed = new URL(url);
  let mediaId = "";
  if (parsed.hostname.includes("youtu.be")) mediaId = parsed.pathname.slice(1).split("?")[0];
  else mediaId = parsed.searchParams.get("v") || "";

  const [oembedData, pageData] = await Promise.all([
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
      .then(r => r.ok ? r.json() as Promise<any> : null).catch(() => null),
    mediaId
      ? fetch(`https://www.youtube.com/watch?v=${mediaId}`, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        }).then(r => r.ok ? r.text() : null).catch(() => null)
      : Promise.resolve(null),
  ]);

  const title = oembedData?.title || "Unknown Title";
  const thumbnail = oembedData?.thumbnail_url || (mediaId ? `https://img.youtube.com/vi/${mediaId}/hqdefault.jpg` : "");
  let duration = 0;
  if (pageData) {
    const m = pageData.match(/"lengthSeconds":"(\d+)"/);
    if (m) duration = parseInt(m[1], 10);
  }
  return { title, thumbnail, duration };
}

// ─── PRIMARY: yt-dlp with iOS client (bypasses YouTube bot detection) ─────────
const inProgress = new Set<string>();

interface ConversionResult {
  fileId: string;
  title: string;
  filePath: string;
}

async function ytDlpConvert(url: string, quality: string): Promise<ConversionResult> {
  const fileId = crypto.randomBytes(16).toString("hex");
  const outputTemplate = path.join(TEMP_DIR, `${fileId}.%(ext)s`);
  const expectedMp3 = path.join(TEMP_DIR, `${fileId}.mp3`);

  return new Promise((resolve, reject) => {
    let titleLine = "";
    let stderr = "";

    const args = [
      url,
      "-x",
      "--audio-format", "mp3",
      "--audio-quality", QUALITY_MAP[quality] || "2",
      "-o", outputTemplate,
      "--no-playlist",
      "--no-warnings",
      "--print", "%(title)s",
      "--no-simulate",
      // tv_embedded → triggers android vr API path, bypasses bot detection on datacenter IPs
      "--extractor-args", "youtube:player_client=tv_embedded",
      "--add-header", "Accept-Language:en-US,en;q=0.9",
    ];

    const proc = spawn("yt-dlp", args, { stdio: ["ignore", "pipe", "pipe"] });
    proc.stdout.on("data", (d: Buffer) => { titleLine += d.toString(); });
    proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });

    const killTimer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error("yt-dlp timed out after 8 minutes"));
    }, 8 * 60_000);

    proc.on("close", (code) => {
      clearTimeout(killTimer);
      if (code !== 0) {
        reject(new Error(`yt-dlp exit ${code}: ${stderr.slice(0, 500)}`));
        return;
      }
      const title = titleLine.trim().split("\n")[0] || "audio";
      if (fs.existsSync(expectedMp3)) {
        resolve({ fileId, title, filePath: expectedMp3 });
        return;
      }
      // Scan for any output file with our ID prefix
      try {
        const files = fs.readdirSync(TEMP_DIR);
        const match = files.find(f => f.startsWith(fileId));
        if (match) {
          resolve({ fileId: match.replace(/\.[^.]+$/, ""), title, filePath: path.join(TEMP_DIR, match) });
        } else {
          reject(new Error("Output file not found"));
        }
      } catch {
        reject(new Error("Failed to locate output file"));
      }
    });

    proc.on("error", (err) => {
      clearTimeout(killTimer);
      reject(new Error(`yt-dlp spawn error: ${err.message}`));
    });
  });
}

// ─── FALLBACK 1: cobalt.tools — open-source, handles YouTube reliably ─────────
async function cobaltConvert(url: string, quality: string): Promise<string> {
  const bitrateMap: Record<string, string> = { "128": "128", "192": "192", "320": "320" };

  const res = await fetch("https://api.cobalt.tools/", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      // Required by cobalt.tools to identify API clients
      "User-Agent": "FastAudio/1.0 (https://fastaudio.cc)",
    },
    body: JSON.stringify({
      url,
      downloadMode: "audio",
      audioFormat: "mp3",
      audioBitrate: bitrateMap[quality] || "192",
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`cobalt.tools ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json() as any;
  console.log("[cobalt] Response:", JSON.stringify(data).slice(0, 300));

  if (data.status === "error") {
    throw new Error(`cobalt.tools error: ${data.error?.code || JSON.stringify(data)}`);
  }

  // tunnel/redirect = direct stream/download URL
  if ((data.status === "tunnel" || data.status === "redirect") && data.url) {
    return data.url;
  }

  // picker = multiple options — prefer audio track
  if (data.status === "picker") {
    const audioUrl = data.audio || data.picker?.find((p: any) => p.type === "audio")?.url || data.picker?.[0]?.url;
    if (audioUrl) return audioUrl;
  }

  throw new Error(`cobalt.tools unexpected response: ${JSON.stringify(data).slice(0, 200)}`);
}

// ─── FALLBACK 2: loader.to ────────────────────────────────────────────────────
const LOADER_API = "https://loader.to/ajax/download.php";
const PROGRESS_BASE = "https://p.savenow.to/api/progress";

async function loaderToConvert(url: string): Promise<string> {
  const initRes = await fetch(`${LOADER_API}?format=mp3&url=${encodeURIComponent(url)}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
  });
  if (!initRes.ok) throw new Error("loader.to failed to initiate");

  const initData = await initRes.json() as any;
  if (!initData.success) throw new Error("loader.to rejected request");

  const jobId = initData.id;
  const progressUrl = initData.progress_url || `${PROGRESS_BASE}?id=${jobId}`;
  const pollIntervals = [1500, 2000, 2500, 3000, 4000];

  for (let i = 0; i < 200; i++) {
    await new Promise(r => setTimeout(r, pollIntervals[Math.min(i, pollIntervals.length - 1)]));
    try {
      const r = await fetch(progressUrl);
      if (!r.ok) continue;
      const data = await r.json() as any;
      if (data.success === 1 && data.download_url) return data.download_url.replace(/\\\//g, "/");
      if (data.success === -1) throw new Error("loader.to conversion failed");
    } catch { continue; }
  }
  throw new Error("loader.to timed out");
}

// ─── Helper: wrap external URL as proxy download link ─────────────────────────
function makeProxyLink(externalUrl: string, safeTitle: string): string {
  const encoded = Buffer.from(externalUrl).toString("base64url");
  return `/api/proxy-download?u=${encoded}&t=${encodeURIComponent(safeTitle)}`;
}

// ─── /info endpoint ───────────────────────────────────────────────────────────
router.post("/info", async (req: Request, res: Response) => {
  try {
    const parsed = GetVideoInfoBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid request" }); return; }

    const { url } = parsed.data;
    if (!isValidMediaUrl(url)) {
      res.status(400).json({ error: "Invalid URL." }); return;
    }

    let info: { title: string; thumbnail: string; duration: number };
    const hasYtDlp = await checkYtDlp();

    if (hasYtDlp) {
      try { info = await ytDlpGetInfo(url); }
      catch { info = await youtubeOembedInfo(url); }
    } else {
      info = await youtubeOembedInfo(url);
    }

    if (info.duration > MAX_DURATION_SECONDS) {
      res.status(400).json({ error: "Media too long. Maximum is 10 hours." }); return;
    }

    res.json(GetVideoInfoResponse.parse(info));
  } catch (err: any) {
    console.error("[info]", err.message);
    res.status(400).json({ error: "Failed to fetch media info. Check the URL and try again." });
  }
});

// ─── YouTube URL detector ─────────────────────────────────────────────────────
function isYouTubeUrl(url: string): boolean {
  try {
    const h = new URL(url).hostname;
    return h.includes("youtube.com") || h.includes("youtu.be");
  } catch { return false; }
}

// ─── /convert endpoint ────────────────────────────────────────────────────────
// Strategy:
//   PRIMARY:  yt-dlp with tv_embedded client (works for YouTube + 1000+ sites)
//   FALLBACK: loader.to (reliable but slow, ~30-90s)
router.post("/convert", async (req: Request, res: Response) => {
  try {
    const parsed = ConvertVideoBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid request" }); return; }

    const { url, quality } = parsed.data;
    if (!isValidMediaUrl(url)) { res.status(400).json({ error: "Invalid URL." }); return; }
    if (!["128", "192", "320"].includes(quality)) {
      res.status(400).json({ error: "Invalid quality." }); return;
    }

    const jobKey = crypto.createHash("md5").update(url + quality).digest("hex");
    if (inProgress.size >= MAX_CONCURRENT) {
      res.status(429).json({ error: "Server busy. Please wait a moment." }); return;
    }
    if (inProgress.has(jobKey)) {
      res.status(400).json({ error: "Already converting this video. Please wait." }); return;
    }

    inProgress.add(jobKey);

    try {
      // ── Get title ──────────────────────────────────────────────────────────
      let title = "audio";
      try { const i = await youtubeOembedInfo(url); title = i.title; } catch {}
      const safeTitle = title.replace(/[^a-zA-Z0-9 _\-]/g, "").trim() || "audio";

      // ── PRIMARY: yt-dlp (tv_embedded bypasses YouTube datacenter IP block) ─
      const hasYtDlp = await checkYtDlp();
      if (hasYtDlp) {
        try {
          console.log(`[yt-dlp] ${url} @ ${quality}kbps`);
          const { fileId, title: dlpTitle } = await ytDlpConvert(url, quality);
          const finalTitle = (dlpTitle || title).replace(/[^a-zA-Z0-9 _\-]/g, "").trim() || "audio";
          console.log(`[yt-dlp] ✅ ${dlpTitle}`);
          res.json(ConvertVideoResponse.parse({
            success: true,
            title: dlpTitle || title,
            download: `/api/download/${fileId}?t=${encodeURIComponent(finalTitle)}`,
          }));
          return;
        } catch (err: any) {
          console.warn(`[yt-dlp] ❌ ${err.message.slice(0, 200)} → loader.to fallback`);
        }
      }

      // ── FALLBACK: loader.to ────────────────────────────────────────────────
      console.log(`[loader.to] ${url}`);
      const externalUrl = await loaderToConvert(url);
      console.log(`[loader.to] ✅ Done`);
      res.json(ConvertVideoResponse.parse({
        success: true,
        title,
        download: makeProxyLink(externalUrl, safeTitle),
      }));

    } finally {
      inProgress.delete(jobKey);
    }
  } catch (err: any) {
    inProgress.delete(crypto.createHash("md5").update((req.body?.url || "") + (req.body?.quality || "")).digest("hex"));
    console.error("[convert] Failed:", err.message);
    res.status(500).json({ error: "Conversion failed. Please try again." });
  }
});

// ─── /download/:fileId — serve yt-dlp local files ─────────────────────────────
router.get("/download/:fileId", (req: Request, res: Response) => {
  const { fileId } = req.params;
  if (!/^[a-f0-9]{32}$/.test(fileId)) {
    res.status(400).json({ error: "Invalid file ID" }); return;
  }

  const filePath = path.join(TEMP_DIR, `${fileId}.mp3`);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found or expired. Please convert again." }); return;
  }

  const rawTitle = req.query.t ? decodeURIComponent(String(req.query.t)) : "audio";
  const safeTitle = rawTitle.replace(/[^a-zA-Z0-9 _\-]/g, "").trim() || "audio";
  const stat = fs.statSync(filePath);

  res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.mp3"`);
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Cache-Control", "no-store");
  res.sendFile(filePath);
});

// ─── /proxy-download — stream external URL (cobalt/loader.to fallback) ────────
router.get("/proxy-download", async (req: Request, res: Response) => {
  const { u, t: titleParam } = req.query;
  if (!u || typeof u !== "string") { res.status(400).json({ error: "Missing URL" }); return; }

  let remoteUrl: string;
  try {
    remoteUrl = Buffer.from(u, "base64url").toString("utf-8");
    new URL(remoteUrl);
    if (!remoteUrl.startsWith("https://")) throw new Error("HTTPS only");
  } catch { res.status(400).json({ error: "Invalid URL" }); return; }

  const rawTitle = titleParam ? decodeURIComponent(String(titleParam)) : "audio";
  const safeTitle = rawTitle.replace(/[^a-zA-Z0-9 _\-]/g, "").trim() || "audio";

  try {
    const upstream = await fetch(remoteUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://cobalt.tools/",
      },
    });

    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream error: ${upstream.status}` }); return;
    }

    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.mp3"`);
    res.setHeader("Content-Type", upstream.headers.get("Content-Type") || "audio/mpeg");
    const cl = upstream.headers.get("Content-Length");
    if (cl) res.setHeader("Content-Length", cl);
    res.setHeader("Cache-Control", "no-store");

    if (!upstream.body) { res.status(502).json({ error: "No body" }); return; }

    const reader = upstream.body.getReader();
    const { Transform } = await import("stream");
    const pass = new Transform({ transform(chunk, _enc, cb) { cb(null, chunk); } });
    res.on("close", () => reader.cancel());
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) { pass.end(); break; }
          pass.push(value);
        }
      } catch { pass.destroy(); }
    })();
    pass.pipe(res);
  } catch (err: any) {
    if (!res.headersSent) res.status(500).json({ error: "Proxy error: " + err.message });
  }
});

// ─── Cleanup: delete files older than 1 hour ──────────────────────────────────
setInterval(() => {
  try {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    for (const file of fs.readdirSync(TEMP_DIR)) {
      const fp = path.join(TEMP_DIR, file);
      try {
        if (now - fs.statSync(fp).mtimeMs > ONE_HOUR) fs.unlinkSync(fp);
      } catch {}
    }
  } catch {}
}, 15 * 60 * 1000);

export default router;
