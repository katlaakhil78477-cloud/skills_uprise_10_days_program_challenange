// preload.js
import { contextBridge, ipcRenderer } from 'electron';

console.log("Preload loaded");

// Expose safe APIs to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  sendCommand: (commandData) => {
    ipcRenderer.send('command-from-renderer', commandData);
  },
  onCommandResponse: (callback) => {
    ipcRenderer.on('command-response', (event, data) => callback(data));
  }
});
