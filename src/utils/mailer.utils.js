import nodemailer from "nodemailer";
import { config } from "../../constants.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.adminMail,
    pass: config.adminMailPassword, // Use 16-char Gmail app password here
  },
});

export async function sendEmail(to, subject, text, html, attachments = []) {
  try {
    await transporter.sendMail({
      from: config.adminMail,
      to,
      subject,
      text,
      html,
      attachments,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);

    throw new Error("Failed to send email");
  }
}


export function adminRegisterMessage(fullName, email, password) {
  return `
Dear ${fullName},

Your admin account has been successfully created.

Login Details:
• Email: ${email}
• Password: ${password}

If you did not request this account, please contact our support team immediately.

Best regards,
The Support Team
`;
}


export function adminLoginMessage(fullName, email) {
  return `
Dear ${fullName},

You have successfully logged in to your admin account.

If you do not recognize this activity, please contact our support team immediately to secure your account.

Best regards,
The Support Team
`;
}



