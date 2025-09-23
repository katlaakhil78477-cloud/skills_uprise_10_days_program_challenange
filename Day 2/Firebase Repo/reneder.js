// renderer.js
console.log("Renderer loaded");

// Example buttons in index.html
const readBtn = document.getElementById('readBtn');
const deleteBtn = document.getElementById('deleteBtn');
const output = document.getElementById('output');

// Send a "scan" command
readBtn.addEventListener('click', () => {
  const commandData = {
    command: 'scan',
    location: 'D:\\Fake folder'
  };
  window.electronAPI.sendCommand(commandData);
});

// Send a "delete" command
deleteBtn.addEventListener('click', () => {
  const commandData = {
    command: 'delete',
    location: 'D:\\Fake folder'
  };
  window.electronAPI.sendCommand(commandData);
});

// Listen for main process responses
window.electronAPI.onCommandResponse((data) => {
  console.log("Response from main:", data);
  output.textContent = JSON.stringify(data, null, 2);
});
