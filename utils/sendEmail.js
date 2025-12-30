const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set. Email sending disabled.');
      return { id: 'mock-email-id', message: 'Email sending disabled (no API key)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'EduWave ',
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Email sent successfully via Resend:', data.id);
    return {
      messageId: data.id,
      response: data,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
