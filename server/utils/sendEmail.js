const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ to, subject, text, html, from }) => {
  try {
    const result = await apiInstance.sendTransacEmail({
      sender: {
        email: "aerthx01@gmail.com",
        name: "AerthX",
      },

      to: [
        {
          email: to,
        },
      ],

      subject,
      textContent: text,
      htmlContent: html,
    });

    console.log("✅ Email sent:", result);

    return result;
  } catch (error) {
    console.error("BREVO API ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;