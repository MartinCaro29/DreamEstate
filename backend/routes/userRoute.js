const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');

const FailedLoginAttempts = require('../models/failedLoginAttemptsModel');

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

const sendUpdateEmail = async (email, isAdminUpdate, newRole = null) => {
  let subject;
  let message;

  if (newRole) {
    subject = 'Roli juaj është ndryshuar';
    message = `
      Përshëndetje, <br><br>
      Një administrator ka ndryshuar rolin tuaj. Roli juaj i ri tani është: <b>${newRole}</b>.
      <br><br>
      Nëse nuk e keni kërkuar këtë ndryshim, ju lutemi kontaktoni mbështetjen menjëherë.
      <br><br>
      Faleminderit!
    `;
  } else {
    subject = isAdminUpdate ? 'Administratori ka ndryshuar profilin tuaj' : 'Profili juaj është përditësuar';
    message = `
      Përshëndetje, <br><br>
      ${isAdminUpdate 
        ? 'Një administrator ka përditësuar informacionin e profilit tuaj.' 
        : 'Ju keni përditësuar profilin tuaj me sukses.'}
      <br><br>
      ${
        isAdminUpdate 
          ? 'Nëse nuk e keni kërkuar këtë ndryshim, ju lutemi kontaktoni mbështetjen menjëherë.' 
          : 'Nëse nuk e keni bërë këtë ndryshim, ju lutemi kontrolloni llogarinë tuaj.' 
      }
      <br><br>
      <b>Vërejtje:</b> Nëse adresa juaj e email-it është ndryshuar, funksionaliteti "Më mbaj mend" nuk është më aktiv. Ju duhet të verifikoni përsëri email-in tuaj.
      <br><br>
      Faleminderit!
    `;
  }

  await transporter.sendMail({
    from: 'electroman784@gmail.com',
    to: email,
    subject: subject,
    html: message
  });
};

// Route: Update User (Normal User)
// Route: Update User (Normal User)
router.patch('/updateUser/:id', async (req, res) => {
  try {
    const { username, email, email_verified, role, remember_me_token } = req.body;

    const updateData = {};
    
    if (username !== undefined) updateData.username = username;

    // If the email is updated, set email_verified to 0
    if (email !== undefined) {
      updateData.email = email;
      updateData.email_verified = 0;  // Set email_verified to 0 when email is updated
      updateData.remember_me_token = null;
      updateData.remember_me_token_created_at = null;
    } else if (email_verified !== undefined) {
      updateData.email_verified = email_verified;
    }

    if (role !== undefined) updateData.role = role;

    if (remember_me_token !== undefined) {
      updateData.remember_me_token = remember_me_token;
      updateData.remember_me_token_created_at = new Date();
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true, select: '-password -created_at' }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Përdoruesi nuk u gjet' });
    }

    // Send the update email to the user (including email verification status)
    await sendUpdateEmail(updatedUser.email, false);  // False because it's not an admin update

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Emri i përdoruesit ose email-i ekziston tashmë', error: error.message });
    }
    res.status(500).json({ success: false, message: 'Gabim gjatë përditësimit të përdoruesit', error: error.message });
  }
});


// Route: Update User by Admin
router.patch('/updateUserByAdmin/:id', async (req, res) => {
  try {
    const { username, email, email_verified, role } = req.body;

    const updateData = {};
    if (username !== undefined) updateData.username = username;

    if (email !== undefined) {
      updateData.email = email;
      updateData.email_verified = 0;  // Set email_verified to 0 when email is updated
      updateData.remember_me_token = null;
      updateData.remember_me_token_created_at = null;
    } else if (email_verified !== undefined) {
      updateData.email_verified = email_verified;
    }

    // Fetch current user to check if the role is changed
    const currentUser = await userModel.findById(req.params.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Përdoruesi nuk u gjet' });
    }

    let roleChanged = false;
    if (role !== undefined && currentUser.role !== role) {
      updateData.role = role;
      roleChanged = true;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true, select: '-password -created_at' }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Përdoruesi nuk u gjet' });
    }

    // Send the update email to the user
    await sendUpdateEmail(updatedUser.email, false);  // False because it's not an admin update

    // If the admin is updating the profile, also send email to the admin
    if (roleChanged) {
      await sendUpdateEmail(updatedUser.email, true, updatedUser.role);  // Admin update with role change
    } else {
      await sendUpdateEmail(updatedUser.email, true);  // Admin update without role change
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Emri i përdoruesit ose email-i ekziston tashmë', error: error.message });
    }
    res.status(500).json({ success: false, message: 'Gabim gjatë përditësimit të përdoruesit', error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    // Fetch all users excluding their passwords
    const users = await userModel.find()
      .select('-password') // Exclude password from response
      .lean(); // Convert to plain JavaScript objects

    // Check if there are users
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found'
      });
    }

    // Return users list
    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
});


router.get('/user/:id', async (req, res) => {
  try {
    // Find user by ID
    const user = await userModel.findById(req.params.id)
      .select('-password') // Exclude password from the response
      .lean(); // Convert to plain JavaScript object

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user data
    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    // Handle invalid ID format or other errors
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
});

router.delete('/deleteUser/:id', async (req, res) => {
  try {
    // Find the user by ID to get their email before deleting
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Përdoruesi nuk u gjet'
      });
    }

    // Delete the user from the database
    await userModel.findByIdAndDelete(req.params.id);

    // Send email after successful deletion
    const mailOptions = {
      from: 'electroman784@gmail.com', // Sender address
      to: user.email, // Recipient address (user's email)
      subject: 'Llogaria Juaj është Fshirë', // Email subject in Albanian
      text: 'Përshëndetje, \n\nLlogaria juaj është fshirë nga platforma jonë. Nëse nuk keni kërkuar këtë veprim, ju lutemi na kontaktoni sa më shpejt. \n\nFaleminderit!' // Email body in Albanian
    };

    // Send email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Gabim gjatë dërgimit të email-it:', error);
        return res.status(500).json({
          success: false,
          message: 'Gabim gjatë dërgimit të email-it',
          error: error.message
        });
      }
      console.log('Email i dërguar: ' + info.response);
    });

    res.status(200).json({
      success: true,
      message: 'Përdoruesi u fshi me sukses'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gabim gjatë fshirjes së përdoruesit',
      error: error.message
    });
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
        email_verified: 0,
        remember_me_token: null
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
  const { email } = req.body;

  // Find user by email
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).send('User not found.');
  }

  if (user.email_verified === 1) {
    return res.status(400).send('Email already verified.');
  }

  // Mark the user as verified
  await userModel.findOneAndUpdate({ email }, { email_verified: 1 });

  res.status(200).json({
    id: user._id, // Send the user's ID in the response
    email: user.email,
    email_verified: 1,
  });
});




router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Only proceed if email is provided
  if (!email) {
    return res.status(400).send('Email-i është i detyrueshëm');
  }

  try {
    // Check if this email is currently blocked
    const failedAttempts = await FailedLoginAttempts.findById(email.toLowerCase());
    
    if (failedAttempts && failedAttempts.failed_attempts >= 7) {
      const blockedTime = Date.now() - failedAttempts.last_failed_attempt.getTime();
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (blockedTime < thirtyMinutes) {
        return res.status(429).json({
          error: 'Llogaria juaj është bllokuar përkohësisht. Ju lutemi provoni më vonë.'
        });
      } else {
        // If 30 minutes have passed, remove the entry
        await FailedLoginAttempts.findByIdAndDelete(email.toLowerCase());
      }
    }

    const findUser = await userModel.findOne({ email }).exec();
    console.log('Found user:', findUser);

    // Handle failed login attempt
    const handleFailedAttempt = async () => {
      try {
        const result = await FailedLoginAttempts.findByIdAndUpdate(
          email.toLowerCase(),
          {
            $inc: { failed_attempts: 1 },
            last_failed_attempt: Date.now()
          },
          { upsert: true, new: true }
        );

        // If this update pushed us over the limit, return the blocking message
        if (result.failed_attempts >= 7) {
          return res.status(429).json({
            error: 'Llogarija juaj është bllokuar përkohësisht. Ju lutemi provoni më vonë.'
          });
        }

        return null; // Indicate we should continue with normal error messages
      } catch (error) {
        console.error('Error updating failed attempts:', error);
        throw error;
      }
    };

    // User not found - count as failed attempt
    if (!findUser) {
      const blockingResult = await handleFailedAttempt();
      if (blockingResult) return blockingResult; // If blocked, return that response
      
      return res.status(404).json({
        error: 'Përdoruesi nuk u gjet'
      });
    }

    // Invalid password - count as failed attempt
    const passOk = bcrypt.compareSync(password, findUser.password);
    if (!passOk) {
      const blockingResult = await handleFailedAttempt();
      if (blockingResult) return blockingResult; // If blocked, return that response
      
      return res.status(400).json({
        error: 'Kredencialet e pavlefshme'
      });
    }

    // If login is successful, remove any failed attempts record
    await FailedLoginAttempts.findByIdAndDelete(email.toLowerCase());

    if (findUser.email_verified === 0) {
      console.log('User not verified, sending to verification step');

      const token = Math.floor(100000 + Math.random() * 900000).toString();
      verificationTokens[findUser.email] = { token, expires: Date.now() + 10 * 60 * 1000 };

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

      return res.status(200).json({ needsVerification: true, email: findUser.email });
    }

    // Handle remember me token
    if (rememberMe === true) {
      if (findUser.remember_me_token) {
        findUser.remember_me_token_created_at = Date.now();
        await findUser.save();
      } else {
        findUser.remember_me_token = crypto.randomBytes(32).toString('hex');
        findUser.remember_me_token_created_at = Date.now();
        await findUser.save();
      }
    }

    jwt.sign({ email: findUser.email, id: findUser._id }, secret, {}, (err, token) => {
      if (err) return res.status(500).send("Diçka shkoi keq me gjenerimin e tokenit");

      console.log('Login successful, sending response with rememberMeToken:', findUser.remember_me_token);

      res.cookie('token', token, { httpOnly: true }).json({
        id: findUser._id,
        email: findUser.email,
        email_verified: findUser.email_verified,
        rememberMeToken: findUser.remember_me_token
      });
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send("Diçka shkoi keq: " + err);
  }
});


router.get('/get-remember-token/:userId', async (req, res) => {
  try {
      const { userId } = req.params;

      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const tokenAge = Date.now() - new Date(user.remember_me_token_created_at).getTime();
      const TWO_DAYS_IN_MS = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

      if (tokenAge > TWO_DAYS_IN_MS) {
          // Token expired, nullify it
          user.remember_me_token = null;
          user.remember_me_token_created_at = null;
          await user.save();
          return res.status(200).json({ rememberMeToken: null, message: 'Token expired' });
      }

      res.json({ rememberMeToken: user.remember_me_token });
  } catch (error) {
      console.error("Error fetching remember_me_token:", error);
      res.status(500).json({ message: "Server error" });
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

  router.post('/request-password-reset', async (req, res) => {
    try {
        let userEmail;
        
        // Check if user is authenticated
        const token = req.cookies.token;
        if (token) {
            // Get user email from token
            const decoded = jwt.verify(token, secret);
            userEmail = decoded.email;
        } else {
            // Get email from request body
            userEmail = req.body.email;
            
            // Verify email exists
            const user = await userModel.findOne({ email: userEmail });
            if (!user) {
                return res.status(404).send('Ky email nuk ekziston.');
            }
        }

        // Generate verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        verificationTokens[userEmail] = {
            token: verificationToken,
            expires: Date.now() + 10 * 60 * 1000 // 10 minutes expiration
        };

        // Send verification email
        const mailOptions = {
            from: 'electroman784@gmail.com',
            to: userEmail,
            subject: 'Rivendosja e Fjalëkalimit',
            text: `Ky është kodi juaj i verifikimit për rivendosjen e fjalëkalimit: ${verificationToken}. Kodi do të skadojë pas 10 minutash.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('Kodi i verifikimit u dërgua me sukses.');
    } catch (err) {
        console.error('Gabim gjatë kërkesës për rivendosjen e fjalëkalimit:', err);
        res.status(500).send('Diçka nuk shkon. Ju lutemi provoni përsëri më vonë.');
    }
});

// Verify Reset Code Route
router.post('/verify-reset-code', async (req, res) => {
    const { email, token } = req.body;
    let userEmail = email;

    // If user is authenticated, get email from token
    const cookieToken = req.cookies.token;
    if (cookieToken) {
        const decoded = jwt.verify(cookieToken, secret);
        userEmail = decoded.email;
    }

    if (!verificationTokens[userEmail]) {
        return res.status(400).send('Token not found or expired.');
    }

    const { token: storedToken, expires } = verificationTokens[userEmail];

    if (Date.now() > expires) {
        delete verificationTokens[userEmail];
        return res.status(400).send('Token has expired.');
    }

    if (storedToken !== token) {
        return res.status(400).send('Invalid token.');
    }

    res.status(200).send('Code verified successfully.');
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  try {
      let userEmail = req.body.email;
      const newPassword = req.body.password;

      if (!newPassword) {
          return res.status(400).send('Ju lutemi jepni një fjalëkalim të ri.');
      }

      // If user is authenticated, get email from token
      const token = req.cookies.token;
      if (token) {
          const decoded = jwt.verify(token, secret);
          userEmail = decoded.email;
      }

      // Check if the user exists
      const user = await userModel.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).send('Përdoruesi nuk u gjet.');
      }

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(newPassword, salt);

      // Update the user's password
      await userModel.findOneAndUpdate(
          { email: userEmail },
          { password: hashedPassword }
      );

      // Remove the verification token (if any)
      delete verificationTokens[userEmail];

      res.status(200).send('Fjalëkalimi u ndryshua me sukses.');
  } catch (err) {
      console.error('Gabim gjatë ndryshimit të fjalëkalimit:', err);
      res.status(500).send('Diçka nuk shkon. Ju lutemi provoni përsëri më vonë.');
  }
});

module.exports = router;
