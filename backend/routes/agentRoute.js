const express = require('express');
const multer = require('multer');
const Agent = require('../models/agentModel');
const app = express();

// Multer setup for parsing form-data
const storage = multer.memoryStorage(); // No files stored on disk
const upload = multer({ storage });

// Middleware for JSON and URL-encoded form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get all agents
app.get('/getAllAgents', async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (err) {
    res.status(500).send('Error fetching agents: ' + err);
  }
});

// Get one agent by ID
app.get('/getAgent/:id', async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).send('Agent not found');
    }
    res.status(200).json(agent);
  } catch (err) {
    res.status(500).send('Error fetching agent: ' + err);
  }
});

// Add a new agent (accept form-data)
app.post('/addAgent', upload.none(), async (req, res) => {
  try {
    const { name, surname, email, phone_number, experience, rating } = req.body;

    // Validate required fields
    if (!name || !surname || !email || !phone_number || !experience || !rating) {
      return res.status(400).send('Missing required fields');
    }

    // Convert form-data fields to appropriate types
    const parsedExperience = parseInt(experience);
    const parsedRating = parseFloat(rating);

    if (isNaN(parsedExperience) || isNaN(parsedRating)) {
      return res.status(400).send('Experience and rating must be numbers');
    }

    const newAgent = new Agent({
      name,
      surname,
      email,
      phone_number,
      experience: parsedExperience,
      rating: parsedRating,
    });

    await newAgent.save();
    res.status(201).send('Agent added successfully');
  } catch (err) {
    res.status(500).send('Error adding agent: ' + err);
  }
});

// Update an agent (accept form-data)
app.patch('/updateAgent/:id', upload.none(), async (req, res) => {
  try {
    const agentId = req.params.id;
    const updates = { ...req.body };

    // Convert experience and rating to appropriate types if provided
    if (updates.experience) {
      updates.experience = parseInt(updates.experience);
      if (isNaN(updates.experience)) {
        return res.status(400).send('Experience must be a number');
      }
    }

    if (updates.rating) {
      updates.rating = parseFloat(updates.rating);
      if (isNaN(updates.rating)) {
        return res.status(400).send('Rating must be a number');
      }
    }

    const updatedAgent = await Agent.findByIdAndUpdate(agentId, { $set: updates }, { new: true });

    if (!updatedAgent) {
      return res.status(404).send('Agent not found');
    }

    res.status(200).json(updatedAgent);
  } catch (err) {
    res.status(500).send('Error updating agent: ' + err);
  }
});

// Delete an agent
app.delete('/deleteAgent/:id', async (req, res) => {
  try {
    const agentId = req.params.id;
    const deletedAgent = await Agent.findByIdAndDelete(agentId);

    if (!deletedAgent) {
      return res.status(404).send('Agent not found');
    }

    res.status(200).send('Agent deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting agent: ' + err);
  }
});

module.exports = app;
