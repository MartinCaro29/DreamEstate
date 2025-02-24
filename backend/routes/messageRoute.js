const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Create transporter for email sending
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'electroman784@gmail.com',
    pass: 'phwz nqal qeoq czbq'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Create a new message and send email
router.post('/addMessage', async (req, res) => {
    try {
      const { property_id, name, email, phone, message } = req.body;
      
      const newMessage = new Message({
        property_id,
        name,
        email,
        phone: phone.replace(/\s/g, ''),
        message
      });
      
      await newMessage.save();
  
      // Send confirmation email to the client
      const clientMailOptions = {
        from: 'electroman784@gmail.com',
        to: email,
        subject: 'Faleminderit për interesin tuaj',
        text: `
          I/E nderuar ${name},
  
          Faleminderit që na kontaktuat në lidhje me pronën tonë. 
          Një nga agjentët tanë profesionistë do t'ju kontaktojë shumë shpejt për t'ju dhënë më shumë informacion.
  
          Detajet e kërkesës tuaj:
          Tel: ${phone}
          Mesazhi: ${message || 'Pa mesazh'}
  
          Me respekt,
          Ekipi i Dream Estate
        `
      };
      
      // Send notification email to admin
      const adminMailOptions = {
        from: 'electroman784@gmail.com',
        to: 'electroman784@gmail.com',
        subject: 'Kërkesë e Re për Pronë',
        text: `
          Kërkesë e re nga:
          Emri: ${name}
          Email: ${email}
          Tel: ${phone}
          Mesazhi: ${message || 'Pa mesazh'}
          ID e pronës: ${property_id}
        `
      };
      
      await Promise.all([
        transporter.sendMail(clientMailOptions),
        transporter.sendMail(adminMailOptions)
      ]);
      
      res.status(201).json({ 
        success: true,
        message: 'Mesazhi u dërgua me sukses' 
      });
    } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).json({ 
        success: false,
        error: 'Pati një problem me dërgimin e mesazhit' 
      });
    }
  });

// Get user email by ID
router.get('/messages/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Përdoruesi nuk u gjet' 
      });
    }
    res.json({ 
      success: true,
      email: user.email 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Pati një problem me marrjen e të dhënave të përdoruesit' 
    });
  }
});

router.get('/messages', async (req, res) => {
    try {
      const messages = await Message.find().sort({ createdAt: -1 }); // Get all messages, newest first
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({
        success: false,
        error: 'Pati një problem me marrjen e mesazheve'
      });
    }
  });

  router.delete('/deleteMessage/:id', async (req, res) => {
    try {
        const messageId = req.params.id;
        const result = await Message.findByIdAndDelete(messageId);

        if (!result) {
            return res.status(404).json({ message: 'Mesazhi nuk u gjet!' });
        }

        res.status(200).json({ message: 'Mesazhi u fshi me sukses!' });
    } catch (error) {
        console.error('Gabim gjatë fshirjes së mesazhit:', error);
        res.status(500).json({ message: 'Gabim serveri!' });
    }
});

module.exports = router;