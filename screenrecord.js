const { exec } = require('child_process');
const path = require('path');

const outputFile = path.join(__dirname, 'screen-recording.mp4');

// Select correct ffmpeg command based on OS
const ffmpegCommand = process.platform === 'win32'
  ? `ffmpeg -y -f gdigrab -framerate 30 -i desktop -t 60 "${outputFile}"`
  : process.platform === 'linux'
  ? `ffmpeg -y -f x11grab -framerate 30 -i :0.0 -t 60 "${outputFile}"`
  : `ffmpeg -y -f avfoundation -framerate 30 -i 1:none -t 60 "${outputFile}"`; // macOS

console.log('🎥 Recording your screen for 1 minute...');

exec(ffmpegCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error.message}`);
    return;
  }
  console.log(`✅ Recording finished! Saved as: ${outputFile}`);
});
