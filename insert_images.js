const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module-free");
const fs = require("fs");
const path = require("path");

async function main() {
    try {
        const docPath = path.resolve(__dirname, "VoteChain_Chapter4_5_Corrected.docx");
        const content = fs.readFileSync(docPath, "binary");
        const zip = new PizZip(content);

        let docXml = zip.file("word/document.xml").asText();

        const imageMap = {
            "4.2": "Figure 4.2 Screenshot of the Voter Registration Page.png",
            "4.3": "Figure 4.3 WebAuthn Biometric Enrolment Prompt.png",
            "4.4": "Figure 4.4 Voter Authentication Interface.png",
            "4.5": "Figure 4.5 Voter Dashboard After Successful Authentication.png",
            "4.6": "Figure 4.6 Election Ballot Interface.png",
            "4.7": "Figure 4.7 Vote Confirmation Screen with Blockchain Transaction Receipt.png",
            "4.8": "Figure 4.8 Duplicate Vote Rejection Notification.png",
            "4.9": "Figure 4.9 PostgreSQL Database Implementation Showing Voter Records.png",
            "4.10": "Figure 4.10 Smart Contract Deployment on Local Hardhat Blockchain Node.png",
            "4.11": "Figure 4.11 Hardhat Smart Contract Unit Test Results.png",
            "4.12": "Figure 4.12 Backend API Testing Using Postman.png",
        };

        // Replace placeholders with tags. 
        // Note: This simple replacement might fail if Word splits the text into multiple XML nodes.
        // We use a regex that accounts for possible XML tags between characters as a best effort.
        Object.keys(imageMap).forEach(num => {
            const escapedNum = num.replace(".", "\\.");
            // This regex tries to match the placeholder even if it's split by XML tags like <w:t>
            // It's a very rough approximation.
            const placeholderRegex = new RegExp("\\[[^\\]]*?Insert Figure " + escapedNum + "[^\\]]*?\\]", "g");
            docXml = docXml.replace(placeholderRegex, "{fig" + num.replace(".", "_") + "}");
        });

        zip.file("word/document.xml", docXml);

        const imageOptions = {
            centered: true,
            getImage(tagValue) {
                return fs.readFileSync(path.resolve(__dirname, "extracted_images/all", tagValue));
            },
            getSize() {
                return [600, 350]; // Width, Height in pixels
            },
        };

        const doc = new Docxtemplater(zip, {
            modules: [new ImageModule(imageOptions)],
            paragraphLoop: true,
            linebreaks: true,
        });

        const data = {};
        Object.keys(imageMap).forEach(num => {
            data["fig" + num.replace(".", "_")] = imageMap[num];
        });

        doc.render(data);

        const buffer = doc.getZip().generate({ type: "nodebuffer" });
        const outputPath = path.resolve(__dirname, "VoteChain_Chapter4_5_Final.docx");
        fs.writeFileSync(outputPath, buffer);

        console.log(`Successfully generated ${outputPath}`);
    } catch (error) {
        console.error("Error generating document:", error);
    }
}

main();
