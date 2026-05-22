const mammoth = require('mammoth');
const fs = require('fs');

async function extractPlaceholders() {
    try {
        const result = await mammoth.extractRawText({path: "VoteChain_Chapter4_5_Corrected.docx"});
        const text = result.value;
        
        // Find anything that looks like an image placeholder, e.g., [Insert Figure X], [Image: ...], etc.
        const matches = text.match(/\[.*?\]|Figure \d+\.\d+:.*?$/gm) || [];
        
        console.log("Found potential image locations/placeholders:");
        matches.forEach(m => console.log(m));
        
        // Let's write the whole text out so we can review it if needed
        fs.writeFileSync('extracted_doc.txt', text);
        console.log("Extracted text written to extracted_doc.txt");
    } catch (e) {
        console.error(e);
    }
}
extractPlaceholders();
