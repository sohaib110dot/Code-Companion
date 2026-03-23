import express from "express";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";

const app = express();
app.use(express.json());

const PORT = 3000;

if (!fs.existsSync("temp")) fs.mkdirSync("temp");

app.post("/convert", async (req, res) => {
  const { url, bitrate } = req.body;
  if (!url) return res.status(400).json({ error: "No URL" });

  const br = bitrate || "192";

  // Cobalt.tools API call
  const apiRes = await fetch("https://api.cobalt.tools/api/json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, isAudioOnly: true }),
  });

  const data = await apiRes.json();
  if (!data.url) return res.status(500).json({ error: "API failed" });

  const input = `temp/in_${Date.now()}.mp3`;
  const output = `temp/out_${Date.now()}.mp3`;

  // Download audio
  const file = await fetch(data.url);
  const stream = fs.createWriteStream(input);
  await new Promise((resolve, reject) => {
    file.body.pipe(stream);
    file.body.on("error", reject);
    stream.on("finish", resolve);
  });

  // FFmpeg conversion
  exec(`ffmpeg -y -i ${input} -b:a ${br}k ${output}`, (err) => {
    if (err) return res.status(500).json({ error: "FFmpeg error" });

    res.download(output, "song.mp3", () => {
      fs.unlinkSync(input);
      fs.unlinkSync(output);
    });
  });
});

app.get("/", (req, res) => res.send("✅ YouTube to MP3 API running"));

app.listen(PORT, () => console.log("Server running..."));
