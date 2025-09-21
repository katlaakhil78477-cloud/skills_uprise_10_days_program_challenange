const { spawn } = require("child_process");
const path = require("path");

const deviceName = "Integrated Webcam"; // Change if your device has a different name
const photoCount = 5;
const delay = 2000; // 2 seconds between photos

async function takePhoto(index) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, `photo_${index}.jpg`);

    console.log(`📸 Capturing photo ${index + 1}...`);

    const ffmpeg = spawn("ffmpeg", [
      "-f", "dshow",
      "-i", `video=${deviceName}`,
      "-frames:v", "1",
      "-q:v", "2", // quality (lower = better)
      "-y", // overwrite if file exists
      filePath
    ]);

    ffmpeg.stderr.on("data", data => process.stderr.write(data));

    ffmpeg.on("close", code => {
      if (code === 0) {
        console.log(`✅ Saved: ${filePath}`);
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}

(async () => {
  console.log(`📷 Taking ${photoCount} photos from webcam...`);
  for (let i = 0; i < photoCount; i++) {
    await takePhoto(i);
    if (i < photoCount - 1) {
      await new Promise(r => setTimeout(r, delay)); // wait before next photo
    }
  }
  console.log("🎉 All photos captured successfully!");
})();
