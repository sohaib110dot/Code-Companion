import express from "express";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";

const app = express();
app.use(express.json());

const PORT = 3000;

// temp folder
if (!fs.existsSync("temp")) {
  fs.mkdirSync("temp");
}

app.post("/convert", async (req, res) => {
  try {
    const { url, bitrate } = req.body;

    if (!url) return res.json({ error: "No URL" });

    const br = bitrate || "192";

    // cobalt API call
    const response = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        isAudioOnly: true,
      }),
    });

    const data = await response.json();

    if (!data.url) {
      return res.json({ error: "API failed" });
    }

    const input = `temp/in_${Date.now()}.mp3`;
    const output = `temp/out_${Date.now()}.mp3`;

    // download audio
    const file = await fetch(data.url);
    const stream = fs.createWriteStream(input);

    await new Promise((res, rej) => {
      file.body.pipe(stream);
      file.body.on("error", rej);
      stream.on("finish", res);
    });

    // ffmpeg convert
    exec(`ffmpeg -y -i ${input} -b:a ${br}k ${output}`, (err) => {
      if (err) return res.json({ error: "FFmpeg error" });

      res.download(output, "song.mp3", () => {
        fs.unlinkSync(input);
        fs.unlinkSync(output);
      });
    });
  } catch (e) {
    res.json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running...");
});
