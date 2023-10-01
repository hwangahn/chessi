const nodemailer = require("nodemailer");
const { verificationTemplate } = require("./templates");
require('dotenv').config();

let username = process.env.MAIL_SERVER_USERNAME;
let password = process.env.MAIL_SERVER_PASSWORD;

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: username,
        pass: password,
    },
});
  

let sendVerificationMail = async (recipients, token) => {
    const info = await transporter.sendMail({
      from: 'chessi.no-reply',
      to: recipients,
      subject: "test ✔",
      text: "Hello world?",
      html: verificationTemplate(token),
    });

    return info;
}

module.exports = { sendVerificationMail }
  


