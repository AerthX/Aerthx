const express = require("express");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();


router.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res  
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }


    try {
   await sendEmail({
      from: `"AerthX Contact Form" <${process.env.MAIL_USER}>`, 
      to: "support@aerthx.com", 
      subject: "New Contact Form Submission",
      text: `You got a message from ${name} (${email}):\n\n${message}`,
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });
  } catch (err) {
  console.error("Email failed:", err);
}

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

router.post("/send-inquiry", async (req, res) => {
  try {
    const { name, email, company, phone, quantity, timeline, notes, project } = req.body;

    if (!name || !email || !project) {
      return res.status(400).json({ success: false, error: "Name, email, and project are required" });
    }



    const mailMessage = `
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Company:</b> ${company || "N/A"}</p>
      <p><b>Phone:</b> ${phone || "N/A"}</p>
      <p><b>Project:</b> ${project}</p>
      <p><b>Quantity:</b> ${quantity || "N/A"}</p>
      <p><b>Timeline:</b> ${timeline || "N/A"}</p>
      <p><b>Notes:</b> ${notes || "N/A"}</p>
    `;

    await sendEmail({
      from: `"AerthX Inquiry" <${process.env.MAIL_USER}>`,
      to: "support@aerthx.com",
      subject: `New High-Volume Inquiry: ${project}`,
      text: `You received a new inquiry for ${project} from ${name} (${email})`,
      html: mailMessage,
    });

    res.json({ success: true, message: "Inquiry sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: "Failed to send inquiry" });
  }
});

module.exports = router;
