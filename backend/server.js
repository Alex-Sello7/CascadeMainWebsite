const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

app.post('/submit', async (req, res) => {
  const { name, email, service, project } = req.body;

  try {
    const transporter = createTransporter();
    
    // Format email content with all form data
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Project Details:</strong></p>
      <p>${project}</p>
    `;

    const mailOptions = {
      from: email,
      to: process.env.BUSINESS_EMAIL,
      subject: `New message from ${name} - Service: ${service}`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nProject Details: ${project}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('success'); // Changed to just 'success'
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});