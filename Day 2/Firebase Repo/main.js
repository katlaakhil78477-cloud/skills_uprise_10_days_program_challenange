// main.js
import { app as electronApp, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";

// 🔹 Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDueImAe7r0YofNEDxfBLfT5C2DcNz62mI",
  authDomain: "projectmanagement-5bf55.firebaseapp.com",
  databaseURL: "https://projectmanagement-5bf55-default-rtdb.firebaseio.com",
  projectId: "projectmanagement-5bf55",
  storageBucket: "projectmanagement-5bf55.firebasestorage.app",
  messagingSenderId: "268431991021",
  appId: "1:268431991021:web:952dfe86ca0c2e9d366ce4",
  measurementId: "G-FRMBWXR6FR"
};

// 🔹 Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
const db = getDatabase(fbApp);
const controlRef = ref(db, "control");

// 🔹 Create Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'))
     .then(() => console.log("✅ Window loaded successfully"))
     .catch(err => console.error("❌ Failed to load window:", err));
}

// 🔹 Firebase Listener
onValue(controlRef, async (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  console.log("🔥 Firebase Data:", data);

  try {
    if (data.command === "delete" && data.location) {
      // Delete file/folder
      fs.rmSync(data.location, { recursive: true, force: true });
      console.log("✅ Deleted:", data.location);

      await update(controlRef, {
        output: { status: "deleted", location: data.location },
        command: "idle",
      });
    }

    if (data.command === "scan" && data.location) {
      // Scan folder
      const files = fs.readdirSync(data.location);
      console.log("📂 Scanned:", files);

      await update(controlRef, {
        output: { status: "scanned", location: data.location, files },
        command: "idle",
      });
    }
  } catch (err) {
    console.error("❌ Error:", err.message);

    await update(controlRef, {
      output: { status: "error", error: err.message },
      command: "idle",
    });
  }
});

// 🔹 Start Electron app
electronApp.whenReady().then(createWindow);

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') electronApp.quit();
});

electronApp.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
