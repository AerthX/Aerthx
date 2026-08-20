const PDFDocument = require("pdfkit");
const { uploadToImageKit } = require("./imagekit");

const generateCertificate = async ({
  certificateId,
  userName,
  projectName,
  tons,
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 50,
      });

      let buffers = [];

      // ✅ collect chunks
      doc.on("data", (chunk) => buffers.push(chunk));

      // ✅ wait until PDF fully done
      doc.on("end", async () => {
        try {
          const pdfBuffer = Buffer.concat(buffers);

          const result = await uploadToImageKit(
            pdfBuffer,
            `certificate_${certificateId}`,
            "/certificates"
          );

          resolve(result.url);
        } catch (err) {
          reject(err);
        }
      });

      doc.on("error", (err) => reject(err));

      // ===== YOUR DESIGN CODE =====
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f8fafc");

      doc.lineWidth(4)
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .stroke("#16a34a");

      doc.fillColor("#16a34a")
        .fontSize(30)
        .text("CARBON OFFSET CERTIFICATE", { align: "center" });

      doc.moveDown(2);

      doc.fillColor("#000")
        .fontSize(14)
        .text("This certifies that", { align: "center" });

      doc.moveDown(0.5);

      doc.fontSize(24)
        .fillColor("#111")
        .text(userName, { align: "center" });

      doc.moveDown();

      doc.fontSize(14)
        .text("has successfully offset", { align: "center" });

      doc.moveDown(0.5);

      doc.fontSize(28)
        .fillColor("#16a34a")
        .text(`${tons} Tonnes of CO₂`, { align: "center" });

      doc.moveDown();

      doc.fontSize(16)
        .fillColor("#000")
        .text(`Project: ${projectName}`, { align: "center" });

      doc.moveDown(2);

      doc.fontSize(10)
        .text(`Certificate ID: ${certificateId}`, 50, 500);

      doc.text(`Issued on: ${new Date().toDateString()}`, 50, 520);

      // ✅ END ONLY ONCE
      doc.end();

    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateCertificate;