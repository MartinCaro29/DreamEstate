const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: 'electroman784@gmail.com', // Replace with your company email
    pass: 'phwz nqal qeoq czbq' // Use an app password for security
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter error:', error);
  } else {
    console.log('Contact form email server is ready');
  }
});

// Contact Form Route
router.post('/contact', async (req, res) => {
  const { email, subject, message } = req.body;

  // Validate required fields
  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Të gjitha fushat janë të detyrueshme.' });
  }

  // Email to the company (Electroman)
  const adminMailOptions = {
    from: email, // Sender's email
    to: 'electroman784@gmail.com', // Replace with your company email
    subject: `New Contact Form Submission: ${subject}`,
    text: `Email: ${email}\n\nMesazhi:\n${message}`
  };

  // Email to the sender (confirmation email)
  const clientMailOptions = {
    from: 'electroman784@gmail.com', // Company email
    to: email, // Sender's email
    subject: 'Faleminderit për interesin tuaj',
    text: `
    I/E nderuar,

    Faleminderit që na kontaktuat!  
    Shërbimi do t'ju kontaktojë shumë shpejt për t'ju dhënë më shumë informacion.

    Me respekt,
    Ekipi i Dream Estate
    `
  };

  try {
    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(clientMailOptions);

    res.status(200).json({ message: 'Mesazhi u dërgua me sukses!' });
  } catch (error) {
    console.error('Gabim gjatë dërgimit të email-it:', error);
    res.status(500).json({ error: 'Gabim gjatë dërgimit të mesazhit. Ju lutemi provoni përsëri më vonë.' });
  }
});

module.exports = router;
