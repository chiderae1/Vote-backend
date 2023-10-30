const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ekwunoc@gmail.com',
        pass: 'mheo jpcx lhsl cnzy'
    },
});

module.exports = transporter;
