const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
} = require('../constants/constants');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const sendActivationMail = async (to, link) => {
  await transporter.sendMail({
    from: SMTP_USER,
    to,
    subject: `Activation account on the Elevon cloud`,
    text: '',
    html: `
    <div>
        <h1>To activate follow the link</h1>
        <a href="${link}">${link}</a>
    </div>
    `,
  });
};

module.exports = { sendActivationMail };
