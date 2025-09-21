const { exec } = require("child_process");
const path = require("path");

// Detect available audio input devices
function getAudioDevice() {
  return new Promise((resolve, reject) => {
    exec('ffmpeg -list_devices true -f dshow -i dummy', (error, stdout, stderr) => {
      if (error) {
        return reject("❌ Could not list devices: " + stderr);
      }

      const lines = stderr.split("\n");

      // Extract devices inside quotes after "Audio"
      const audioDevices = lines
        .filter(line => line.toLowerCase().includes("audio"))
        .map(line => {
          const match = line.match(/"([^"]+)"/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

      if (audioDevices.length === 0) {
        return reject("❌ No audio devices found.");
      }

      // Choose the first microphone
      resolve(audioDevices[0]);
    });
  });
}

// Record audio for 1 minute
async function recordAudio() {
  try {
    const mic = await getAudioDevice();
    console.log(`🎤 Using microphone: ${mic}`);

    const filePath = path.join(__dirname, "audio.mp3");

    // ffmpeg command: record for 60 seconds, audio only
    const cmd = `ffmpeg -f dshow -i audio="${mic}" -t 00:01:00 "${filePath}"`;

    console.log("🎧 Recording audio for 1 minute...");

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error recording audio:", stderr);
      } else {
        console.log(`✅ Audio saved: ${filePath}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

recordAudio();
