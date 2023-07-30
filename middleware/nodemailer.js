const nodemailer = require('nodemailer');
const secure_configuration = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   // type: 'OAuth2',
    user: secure_configuration.EMAIL_USERNAME,
    pass: secure_configuration.PASSWORD,
   // clientId: secure_configuration.CLIENT_ID,
    //clientSecret: secure_configuration.CLIENT_SECRET,
    //refreshToken: secure_configuration.REFRESH_TOKEN
  }
});

module.exports = transporter;