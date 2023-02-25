
const nodemailer = require('nodemailer');

const avaibleMailSubjects = {
  orderDelivered: 'Order delivered'
};

const sendMail = async (subject = '') => {
  try {
    const mailSubjectsKeys = Object.keys(avaibleMailSubjects);

    if (!mailSubjectsKeys.includes(subject)) {
      return {
        error: true,
        msg: 'Email subject not allowed'
      };
    }

    const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: 'bar@example.com, baz@example.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>' // html body
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    if (info.messageId) {
      console.log(info.messageId);
      return true;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = sendMail;
