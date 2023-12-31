const nodemailer = require("nodemailer");
const { verificationTemplate, passwordResetTemplate } = require("./templates");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: process.env.MAIL_SERVER_USERNAME,
        pass: process.env.MAIL_SERVER_PASSWORD,
    },
});
  

let sendVerificationMail = async (recipients, token) => {
    const info = await transporter.sendMail({
      from: 'chessi.no-reply',
      to: recipients,
      subject: "Verify your email ✔",
      html: verificationTemplate(token),
    });

    return info;
}

let sendPassword = async (recipients, password) => {
    const info = await transporter.sendMail({
        from: 'chessi.no-reply',
        to: recipients,
        subject: "Password reset",
        html: passwordResetTemplate(password),
      });
  
      return info;
}

module.exports = { sendVerificationMail, sendPassword }
  


