const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('extracted_doc.txt', 'utf8');

const imageMap = {
  'Figure 4.2': '01_landing_page.png',
  'Figure 4.4': '03_login_page_filled.png',
  'Figure 4.5': '04_ballot_page.png',
  'Figure 4.6': '05_candidate_selected.png',
  'Figure 4.7': '08_receipt_page.png',
  'Figure 4.8': '03b_login_error.png'
};

const missingImages = [
  'Figure 4.1', 'Figure 4.3', 'Figure 4.9', 'Figure 4.10', 'Figure 4.11', 'Figure 4.12'
];

// Replace the [Insert ...] lines with markdown images
content = content.replace(/\[Insert Figure (4\.\d+).*?\]/g, (match, p1) => {
  if (imageMap[p1]) {
    const imgPath = path.join(__dirname, 'screenshot-tool', 'captures', 'voter', imageMap[p1]).replace(/\\/g, '/');
    return `![${p1}](file:///${imgPath})`;
  } else if (missingImages.includes(p1)) {
    return `> [!WARNING]\n> **MISSING IMAGE:** Please insert ${p1} here.`;
  }
  return match;
});

// Write to md
fs.writeFileSync('FINAL_REPORT_V5.md', content);
console.log('FINAL_REPORT_V5.md created!');
