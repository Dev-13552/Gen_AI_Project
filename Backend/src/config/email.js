const nodemailer = require("nodemailer");
const { Resend } = require('resend');
require("dotenv").config();

//  const verifyEmail = async (token, email) => {
//   // let mailTransporter = nodemailer.createTransport({

//   //   host: "smtp.gmail.com",
//   //   port: 587,           // or 465
//   //   secure: false,       // true if using port 465
//   //   family: 4,
//   //   connectionTimeout: 10000,
//   //   greetingTimeout: 10000,
//   //   auth: {
//   //     user: process.env.MAIL_USER,
//   //     pass: process.env.MAIL_PASS,
//   //   },
//   // });

//   // let mailDetails = {
//   //   from: process.env.MAIL_USER,
//   //   to: email,
//   //   subject: "Email Verification",
//   //   text: `Hi! There, You have recently visited our website and entered your email.
//   //           Please follow the given link to verify your email
//   //           https://gen-ai-project-tau.vercel.app/verify/${token}
//   //           Thanks`,
//   // };

//   // mailTransporter.sendMail(mailDetails, function (err, data) {
//   //   if (err) {
//   //     console.log("Error Occurs", err);
//   //   } else {
//   //     console.log("Email sent successfully");
//   //   }
//   // });
// };


const resend = new Resend(process.env.RESEND_API_KEY);

const verifyEmail = async (token, email) => {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email: https://gen-ai-project-tau.vercel.app/verify/${token}`,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Error Occurs", err);
    throw err;
  }
};

module.exports = {verifyEmail}