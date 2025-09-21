const { spawn } = require("child_process");
const path = require("path");

const outputFile = path.join(__dirname, "output.mp4");
console.log("🎥 Starting 20 second recording from webcam + microphone...");

const ffmpeg = spawn("ffmpeg", [
  "-f", "dshow",
  "-i", "video=Integrated Webcam:audio=Microphone (2- Realtek(R) Audio)",
  "-t", "20",
  "-vcodec", "libx264",
  "-preset", "ultrafast",
  "-crf", "23",
  "-y", // overwrite output file if exists
  outputFile
]);

ffmpeg.stderr.on("data", data => process.stderr.write(data));
ffmpeg.on("close", code => {
  console.log(code === 0 ? `✅ Recording saved to ${outputFile}` : `❌ Error (code ${code})`);
});
