const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

async function generate() {
  try {
    console.log("Starting generation...");
    
    const doc = new Document({
      creator: "VoteChain System",
      description: "Final Project Report",
      title: "Final Project Report",
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "CHAPTER FOUR",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "This is a simplified version of the report to fix the opening error.",
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    console.log("Packing document...");
    const buffer = await Packer.toBuffer(doc);
    
    console.log("Writing file...");
    // Use a unique name to avoid sync locks
    const filename = `FINAL_REPORT_DEBUG_${Date.now()}.docx`;
    fs.writeFileSync(filename, buffer);
    
    console.log(`✅ Success! Created ${filename}`);
  } catch (error) {
    console.error("❌ Error during generation:", error);
  }
}

generate();
