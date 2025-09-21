// delete-data.js
const fs = require('fs');
const path = require('path');

const folderPath = 'D:\\Fake floder';

function deleteFolderContents(folder) {
  if (!fs.existsSync(folder)) {
    console.log('Folder does not exist:', folder);
    return;
  }

  const files = fs.readdirSync(folder);
  for (const file of files) {
    const filePath = path.join(folder, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively delete subfolder contents first
      deleteFolderContents(filePath);
      // Then remove the empty folder
      fs.rmdirSync(filePath);
    } else {
      // Delete file
      fs.unlinkSync(filePath);
    }
  }
  console.log('All contents deleted from:', folder);
}

// Call the function
deleteFolderContents(folderPath);
