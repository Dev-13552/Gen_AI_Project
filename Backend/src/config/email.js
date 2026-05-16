const nodemailer = require("nodemailer");
require("dotenv").config();

 const verifyEmail = async (token, email) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    family: 4,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  let mailDetails = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Hi! There, You have recently visited our website and entered your email.
            Please follow the given link to verify your email
            https://gen-ai-project-tau.vercel.app/verify/${token}
            Thanks`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = {verifyEmail}