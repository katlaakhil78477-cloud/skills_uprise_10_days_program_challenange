// take-screenshots.js
const screenshot = require('screenshot-desktop');
const path = require('path');

async function takeScreenshots() {
  for (let i = 1; i <= 5; i++) {
    try {
      const filePath = path.join(__dirname, `screenshot_${i}.png`);
      await screenshot({ filename: filePath });
      console.log(`✅ Screenshot ${i} saved at ${filePath}`);
    } catch (err) {
      console.error('❌ Error taking screenshot:', err);
    }
  }
}

takeScreenshots();
