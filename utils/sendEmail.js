const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create a transporter object using nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: true,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  // create an email message object
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the email using the transporter
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
