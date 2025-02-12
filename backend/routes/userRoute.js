const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');

const secret = 'asdfe45we45w345wegw345werjktjwertkjfdgfgfsgf';
const salt = bcrypt.genSaltSync(10);

router.use(cookieParser());

const verificationTokens = {};

// Create transporter with simplified security settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: 'electroman784@gmail.com',
    pass: 'phwz nqal qeoq czbq'
  },
  tls: {
    rejectUnauthorized: false // Ignore self-signed certificate error
  }
});

// Verify the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Transporter error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Register Route
// Register Route
router.post('/register', async (req, res) => {
    const userInfo = req.body;
  
    try {
      // Check for missing fields
      if (!userInfo.username || !userInfo.email || !userInfo.password) {
        return res.status(400).send("Të gjitha fushat janë të detyrueshme.");
      }
  
      // Check for password length
      if (userInfo.password.length < 8) {
        return res.status(400).send("Fjalëkalimi duhet të ketë të paktën 8 karaktere.");
      }
  
      // Check if email or username already exists
      let foundUserByEmail = await userModel.findOne({ email: userInfo.email }).exec();
      let foundUserByUsername = await userModel.findOne({ username: userInfo.username }).exec();
  
      if (foundUserByEmail && foundUserByUsername) {
        return res.status(400).send("Ky përdorues dhe ky email ekzistojnë tashmë.");
      }
      if (foundUserByUsername) {
        return res.status(400).send("Ky përdorues ekziston tashmë.");
      }
      if (foundUserByEmail) {
        return res.status(400).send("Ky email është përdorur tashmë.");
      }
  
      // Create new user
      let newUser = new userModel({
        username: userInfo.username,
        email: userInfo.email,
        password: bcrypt.hashSync(userInfo.password, salt),
        email_verified: 0
      });
  
      await newUser.save();
  
      // Generate verification token
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      verificationTokens[userInfo.email] = {
        token,
        expires: Date.now() + 10 * 60 * 1000
      };
  
      // Send verification email
      const mailOptions = {
        from: 'electroman784@gmail.com',
        to: userInfo.email,
        subject: 'Verifikimi i Email-it',
        text: `Ky është kodi juaj i verifikimit: ${token}. Kodi do të skadojë pas 10 minutash.`
      };
  
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Mesazhi u dërgua: %s', info.messageId);
        res.status(200).send('Përdoruesi u regjistrua. Verifikimi i email-it u dërgua.');
      } catch (emailError) {
        console.error('Gabim gjatë dërgimit të email-it:', emailError);
        res.status(200).send('Përdoruesi u regjistrua, por verifikimi i email-it dështoi. Ju lutemi kontaktoni mbështetjen.');
      }
  
    } catch (err) {
      // Handle Mongoose duplicate key errors
      if (err.code === 11000) {  
        if (err.keyPattern.email) {
          return res.status(400).send("Ky email është përdorur tashmë.");
        }
        if (err.keyPattern.username) {
          return res.status(400).send("Ky përdorues ekziston tashmë.");
        }
      }
  
      console.error('Gabim gjatë regjistrimit:', err);
      res.status(500).send('Diçka nuk shkon. Ju lutemi provoni përsëri më vonë.');
    }
  });
  

// Verify Email Route
router.post('/verify-email', async (req, res) => {
  const { email, token } = req.body;

  if (!verificationTokens[email]) {
    return res.status(400).send('Token not found or expired.');
  }

  const { token: storedToken, expires } = verificationTokens[email];

  if (Date.now() > expires) {
    delete verificationTokens[email];
    return res.status(400).send('Token has expired.');
  }

  if (storedToken !== token) {
    return res.status(400).send('Invalid token.');
  }

  // Token is valid; mark the user as verified
  await userModel.findOneAndUpdate({ email }, { email_verified: 1 });

  delete verificationTokens[email];
  res.status(200).send('Email verified successfully.');
});

// Login Route

router.post('/login', async (req, res) => {
    const userData = req.body;
    try {
      const findUser = await userModel.findOne({ email: userData.email }).exec();
      console.log('Found user:', findUser);
      
      if (findUser) {
        const passOk = bcrypt.compareSync(userData.password, findUser.password);
        console.log('Password check:', passOk);
        console.log('Email verified status:', findUser.email_verified);
        
        if (passOk) {
          // Check email verification before allowing login
          if (findUser.email_verified === 0) {
            console.log('User not verified, sending to verification step');
            // Generate a new verification token
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            verificationTokens[findUser.email] = {
              token,
              expires: Date.now() + 10 * 60 * 1000
            };
  
            // Send verification email
            try {
              const mailOptions = {
                from: 'electroman784@gmail.com',
                to: findUser.email,
                subject: 'Kodi i ri i Verifikimit',
                text: `Ky është kodi juaj i ri i verifikimit: ${token}. Kodi do të skadojë pas 10 minutash.`,
              };
              await transporter.sendMail(mailOptions);
            } catch (emailError) {
              console.error('Error sending verification email:', emailError);
            }
  
            return res.status(200).json({
              needsVerification: true,
              email: findUser.email,
              email_verified: 0
            });
          }
  
          jwt.sign({ email: findUser.email, id: findUser._id }, secret, {}, (err, token) => {
            if (err) {
              console.error('Error generating token:', err);
              res.status(500).send("Something is wrong");
            } else {
              console.log('Login successful, sending response');
              res.cookie('token', token, { httpOnly: true }).json({
                id: findUser._id,
                email: findUser.email,
                email_verified: findUser.email_verified
              });
            }
          });
        } else {
          res.status(400).send('Invalid credentials');
        }
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).send("Something is wrong: " + err);
    }
  });

// Logout Route
router.post('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true }).json('ok');
});

// Resend Verification Code Route
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send('Ky email nuk ekziston.');
      }
  
      if (user.email_verified) {
        return res.status(400).send('Email-i është verifikuar tashmë.');
      }
  
      // Generate a new token
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      verificationTokens[email] = {
        token,
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes expiration
      };
  
      // Send the verification email
      const mailOptions = {
        from: 'electroman784@gmail.com',
        to: email,
        subject: 'Kodi i ri i Verifikimit',
        text: `Ky është kodi juaj i ri i verifikimit: ${token}. Kodi do të skadojë pas 10 minutash.`,
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).send('Kodi i verifikimit u ridërgua me sukses.');
    } catch (err) {
      console.error('Gabim gjatë ridërgimit të kodit të verifikimit:', err);
      res.status(500).send('Diçka nuk shkon. Ju lutemi provoni përsëri më vonë.');
    }
  });

module.exports = router;
