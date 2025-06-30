// netlify/functions/contact.js
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, email, phone, subject, message } = JSON.parse(event.body);

    // Validation
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Please fill in all required fields' }),
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your app password
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // your email to receive messages
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #8B5CF6; text-align: center; margin-bottom: 30px;">New Contact Form Submission</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Contact Information:</h3>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: #fff; padding: 20px; border-left: 4px solid #8B5CF6; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; color: #555;">${message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e8f4fd; border-radius: 8px;">
              <p style="margin: 0; color: #666;">
                Reply to: <a href="mailto:${email}" style="color: #8B5CF6; text-decoration: none;">${email}</a>
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Auto-reply to sender
    const autoReply = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for reaching out! - Gowtham',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #8B5CF6; text-align: center;">Thank You, ${name}!</h2>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for reaching out through my portfolio. I've received your message and will get back to you as soon as possible, usually within 24 hours.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 3px solid #8B5CF6;">
                <p style="margin: 0; color: #555;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #555;">
                Best regards,<br>
                <strong style="color: #8B5CF6;">Gowtham V</strong><br>
                Full Stack Developer
              </p>
              
              <div style="margin-top: 20px;">
                <a href="https://linkedin.com/in/gowtham-v-cse" style="color: #8B5CF6; text-decoration: none; margin: 0 10px;">LinkedIn</a> |
                <a href="https://github.com/gowthamvetri" style="color: #8B5CF6; text-decoration: none; margin: 0 10px;">GitHub</a> |
                <a href="mailto:gowthamvetriii@gmail.com" style="color: #8B5CF6; text-decoration: none; margin: 0 10px;">Email</a>
              </div>
            </div>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReply);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully!' 
      }),
    };

  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to send message. Please try again.' 
      }),
    };
  }
};