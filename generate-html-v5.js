const fs = require('fs');
const path = require('path');

const text = fs.readFileSync('extracted_doc.txt', 'utf8');
const capturesDir = path.join(__dirname, 'screenshot-tool', 'captures', 'voter');

const imageMap = {
  'Figure 4.2: Voter Registration Interface': '01_landing_page.png',
  'Figure 4.4: Voter Authentication Interface': '03_login_page_filled.png',
  'Figure 4.5: Voter Dashboard After Successful Authentication': '04_ballot_page.png',
  'Figure 4.6: Election Ballot Interface': '05_candidate_selected.png',
  'Figure 4.7: Vote Confirmation Screen with Blockchain Transaction Receipt': '08_receipt_page.png',
  'Figure 4.8: Duplicate Vote Rejection Notification': '03b_login_error.png'
};

const missingImages = [
  'Figure 4.1: System Architecture Diagram',
  'Figure 4.3: WebAuthn Biometric Enrolment Prompt',
  'Figure 4.9: PostgreSQL Database Implementation Showing Voter Records',
  'Figure 4.10: Smart Contract Deployment on Local Hardhat Blockchain Node',
  'Figure 4.11: Hardhat Smart Contract Unit Test Results',
  'Figure 4.12: Backend API Testing Using Postman'
];

let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Final Project Report - Chapters 4 & 5</title>
    <style>
        body { font-family: "Times New Roman", Times, serif; line-height: 1.6; color: #333; max-width: 850px; margin: 0 auto; padding: 2rem; background-color: #f9f9f9; }
        .page-content { background-color: #fff; padding: 4rem; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        h1 { text-align: center; font-size: 1.8rem; margin-top: 3rem; margin-bottom: 2rem; text-transform: uppercase; }
        h2 { font-size: 1.4rem; margin-top: 2rem; }
        h3 { font-size: 1.2rem; margin-top: 1.5rem; }
        p { margin-bottom: 1rem; text-align: justify; }
        table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .table-caption, .figure-caption { text-align: center; font-weight: bold; margin-bottom: 0.5rem; }
        .image-container { text-align: center; margin: 2rem 0; }
        .image-container img { max-width: 100%; height: auto; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .missing-image { display: inline-block; padding: 40px; background-color: #ffebee; border: 2px dashed #f44336; color: #d32f2f; font-weight: bold; text-align: center; width: 80%; margin: 1rem auto; }
        pre { background: #f4f4f4; padding: 15px; overflow-x: auto; font-family: monospace; border-left: 4px solid #4CAF50; }
    </style>
</head>
<body>
    <div class="page-content">
`;

// Basic parsing logic to replace placeholders with actual image tags
let content = text;

// Fix code block
content = content.replace('function castVote(uint256 _electionId, uint256 _candidateId) external {\n\n    require(registry.isRegistered(msg.sender), "Not a registered voter");\n\n    require(!hasVoted[_electionId][msg.sender], "Already voted");\n\n\n\n    votes[_electionId][_candidateId]++;\n\n    hasVoted[_electionId][msg.sender] = true;\n\n\n\n    emit VoteCast(_electionId, _candidateId, msg.sender);\n\n}', '<pre><code>function castVote(uint256 _electionId, uint256 _candidateId) external {\n    require(registry.isRegistered(msg.sender), "Not a registered voter");\n    require(!hasVoted[_electionId][msg.sender], "Already voted");\n\n    votes[_electionId][_candidateId]++;\n    hasVoted[_electionId][msg.sender] = true;\n\n    emit VoteCast(_electionId, _candidateId, msg.sender);\n}</code></pre>');

// Process tables manually (basic detection based on known structures from the text)
content = content.replace('Component\n\nMinimum\n\nRecommended', '<table><tr><th>Component</th><th>Minimum</th><th>Recommended</th></tr>');
content = content.replace('Biometric-capable device for WebAuthn', 'Biometric-capable device for WebAuthn</td></tr></table>');
content = content.replace(/Processor\n\n/g, '<tr><td>Processor</td><td>');
content = content.replace(/Intel Core i3 or equivalent dual-core\n\n/g, 'Intel Core i3 or equivalent dual-core</td><td>');
content = content.replace(/Intel Core i5 or higher\n\n/g, 'Intel Core i5 or higher</td></tr>');
content = content.replace(/RAM\n\n/g, '<tr><td>RAM</td><td>');
content = content.replace(/4GB\n\n/g, '4GB</td><td>');
content = content.replace(/8GB or more\n\n/g, '8GB or more</td></tr>');
// Just to be safe, I'll let the text flow for the rest of the tables or fix them specifically later

// Replace image placeholders
const lines = content.split('\\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i].trim();
  
  if (line.startsWith('[Insert Figure')) {
    continue; // Skip the [Insert...] text
  }
  
  if (line.startsWith('Figure 4.')) {
    // Check if we have an image for this
    let found = false;
    for (const [caption, imgName] of Object.entries(imageMap)) {
      if (line.includes(caption.split(':')[0])) {
        const imgPath = path.join(capturesDir, imgName).replace(/\\\\/g, '/');
        html += \`
        <div class="image-container">
            <img src="\${imgPath}" alt="\${line}">
            <div class="figure-caption">\${line}</div>
        </div>\`;
        found = true;
        break;
      }
    }
    
    if (!found) {
      for (const missing of missingImages) {
         if (line.includes(missing.split(':')[0])) {
            html += \`
            <div class="image-container">
                <div class="missing-image">
                    [MISSING IMAGE]<br>
                    Please insert the screenshot for:<br>\${line}
                </div>
                <div class="figure-caption">\${line}</div>
            </div>\`;
            found = true;
            break;
         }
      }
    }
    
    if(found) continue;
  }
  
  // Format headings
  if (line.match(/^CHAPTER (FOUR|FIVE)/)) {
    html += \`<h1>\${line}<br>\`;
    if(lines[i+2]) {
      html += \`\${lines[i+2]}</h1>\`;
      i+=2;
    } else {
      html += \`</h1>\`;
    }
    continue;
  }
  
  if (line.match(/^4\\.\\d \\w+/) || line.match(/^5\\.\\d \\w+/)) {
    html += \`<h2>\${line}</h2>\`;
    continue;
  }
  
  if (line.match(/^4\\.\\d\\.\\d \\w+/) || line.match(/^5\\.\\d\\.\\d \\w+/)) {
    html += \`<h3>\${line}</h3>\`;
    continue;
  }
  
  if (line.length > 0) {
    html += \`<p>\${line}</p>\`;
  }
}

html += \`
    </div>
</body>
</html>\`;

fs.writeFileSync('FINAL_REPORT_V5.html', html);
console.log('Generated FINAL_REPORT_V5.html');
