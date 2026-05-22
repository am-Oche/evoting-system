const fs = require('fs');
const { marked } = require('marked');

const mdContent = fs.readFileSync('FINAL_REPORT_V5.md', 'utf8');
const bodyHtml = marked(mdContent);

const html = `<!DOCTYPE html>
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
        img { max-width: 100%; height: auto; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: block; margin: 1.5rem auto; }
        blockquote { border-left: 4px solid #f44336; background-color: #ffebee; padding: 10px 20px; margin: 20px 0; color: #d32f2f; font-weight: bold; text-align: center; }
        pre { background: #f4f4f4; padding: 15px; overflow-x: auto; font-family: monospace; border-left: 4px solid #4CAF50; }
    </style>
</head>
<body>
    <div class="page-content">
        ${bodyHtml}
    </div>
</body>
</html>`;

fs.writeFileSync('FINAL_REPORT_V5.html', html);
console.log('HTML file successfully generated!');
