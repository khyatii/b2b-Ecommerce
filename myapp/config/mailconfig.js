var nodemailer = require('nodemailer');

// Create the transporter with the required configuration for Gmail
// change the user and pass !
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
  // use SSL
    port:465,
    secureConnection: true, // use SSL

    auth: {
        // user: 'user.900gpt@gmail.com',
        // pass: 'Admin@123#'
        user: 'usertest0044@gmail.com',
        pass: 'test@123#'
    }
});

module.exports = transporter

