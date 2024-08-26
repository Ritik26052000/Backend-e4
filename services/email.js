const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });


  async function sendEmail(to, subject, text, html) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "sonwanianshu2000@gmail.com", // sender address
      to,// list of receivers
      subject,// Subject line
      text, // plain text body
      html, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }


  module.exports = sendEmail;