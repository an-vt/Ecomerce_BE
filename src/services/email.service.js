'use strict';

const { NotFoundError } = require('../core/error.response');
const {
  runProducerEmail,
} = require('../tests/message_queue/rabbitmq/providerDLXEmail.producer');
const { replacePlaceholder } = require('../utils');
const { newOTP } = require('./otp.service');
const { getTemplate } = require('./template.service');

const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject = 'Xac nhan email dang ki',
  text = 'Xac nhan',
}) => {
  try {
    const mailOptions = {
      from: ` "Michael" <${process.env.EMAIL_USER}> `,
      to: toEmail,
      subject: subject,
      text: text,
      html: html,
    };

    runProducerEmail(mailOptions).catch(console.error);
  } catch (error) {
    console.error('error send email', error);
    return error;
  }
};

const sendEmailToken = async ({ email }) => {
  try {
    // 1. get token
    const token = await newOTP({ email });

    // 2. get template
    const template = await getTemplate({ tem_name: 'HTMl Email Token' });

    if (!template) {
      throw new NotFoundError('Template not found');
    }

    // 3. replace placeholder with params
    const html = replacePlaceholder(template.tem_html, {
      token: `http://localhost:3000/v1/api/user/welcome_back?token=${token.otp_token}`,
    });

    // 4. send email
    sendEmailLinkVerify({ html, toEmail: email }).catch((err) =>
      console.error(err)
    );

    return 1;
  } catch (error) {
    console.error('error send email token', error);
  }
};

module.exports = {
  sendEmailToken,
};
