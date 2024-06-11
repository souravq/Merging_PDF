const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const path = require("path");

async function mergePdfs(pdfPaths, outputPath) {
  // Create a new PDFDocument
  const mergedPdf = await PDFDocument.create();

  // Iterate over the PDF files and merge them
  for (const pdfPath of pdfPaths) {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const copiedPages = await mergedPdf.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices()
    );
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  // Write the merged PDF to a file
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, mergedPdfBytes);
}

// List of PDFs to merge
// Define the paths to the PDF files
const pdfFiles = [
  path.join(__dirname, "pdf1.pdf"),
  path.join(__dirname, "pdf2.pdf"),
];

// Output path for the merged PDF
const outputPdfPath = "merged_output.pdf";

// Merge the PDFs
mergePdfs(pdfFiles, path.join(__dirname, "merged.pdf"))
  .then(() => {
    console.log(`Merged PDF saved to ${outputPdfPath}`);
  })
  .catch((error) => {
    console.error("Error merging PDFs:", error);
  });
