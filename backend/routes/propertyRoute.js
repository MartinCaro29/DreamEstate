let express = require('express');
let Property = require('../models/propertyModel');
let Agent = require('../models/agentModel');
let multer = require('multer');
let path = require('path');
let { v4: uuidv4 } = require('uuid');
let app = express();
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Images'); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

// Slug generation function
const generateSlug = async (name) => {
  let baseSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  let slug = baseSlug;
  let count = 0;
  while (await Property.findOne({ slug })) {
    count++;
    slug = `${baseSlug}-${count}`;
  }
  return slug;
};

// Add new property
app.post("/addProperty", upload.single('image'), async (req, res) => {
    try {
      const {
        name, address, coordX, coordY, price, beds, baths, area, 
        category, status, sell_type, agentId
      } = req.body;
  
      // Convert string fields to numbers
      const parsedCoordX = parseFloat(coordX);
      const parsedCoordY = parseFloat(coordY);
      const parsedPrice = parseFloat(price);
      const parsedBeds = parseInt(beds);
      const parsedBaths = parseInt(baths);
      const parsedArea = parseInt(area);
  
      // Check if agent exists
     
      if (status!=="ne verifikim") {
        return res.status(404).send("Gabim ne shtimin e prones");
      }
  
      if (
        !name || !address || isNaN(parsedCoordX) || isNaN(parsedCoordY) || 
        isNaN(parsedPrice) || isNaN(parsedBeds) || isNaN(parsedBaths) || 
        isNaN(parsedArea) || !category || !sell_type || !req.file 
      ) {
        return res.status(400).send("Missing or invalid required fields");
      }
  
      const slug = await generateSlug(name);
  
      let newProperty = new Property({
        name,
        address,
        coordX: parsedCoordX,
        coordY: parsedCoordY,
        price: parsedPrice,
        beds: parsedBeds,
        baths: parsedBaths,
        area: parsedArea,
        category,
        status,
        sell_type,
        slug,
        agent: agentId,
        image: `/Images/${req.file.filename}`
      });
  
      await newProperty.save();
      res.status(200).send("Property added successfully");
    } catch (err) {
      res.status(500).send("Property not added: " + err);
    }
  });
  
  // Updated get all properties route with agent information
  app.get("/getAllProperties", async (req, res) => {
    try {
        let properties = await Property.find({ status: 'ne shitje' })
        .populate('agent', 'name surname phone_number rating'); // Populate agent details
      res.status(200).json(properties);
    } catch (err) {
      res.status(500).send("Gabim gjate marrjes se pronave!");
    }
  });
  
  // Updated get one property route with agent information
  app.get("/getOneProperty/:slug", async (req, res) => {
    try {
      const propertySlug = req.params.slug;
      let property = await Property.findOne({ 
        slug: propertySlug, 
        status: { $ne: 'e shitur' } 
      }).populate('agent'); // Populate all agent details
    
      if (!property) {
        return res.status(404).send("Prona nuk gjendet ose eshte shitur!");
      }
    
      res.status(200).json(property);
    } catch (err) {
      res.status(500).send("Error fetching property with slug: " + req.params.slug);
    }
  });
  
  // Updated update property route
  app.patch("/updateProperty/:id", upload.single('image'), async (req, res) => {
    try {
      const propertyId = req.params.id;
      const propertyInfo = { ...req.body };
  
      if (propertyInfo.agentId) {
        const agent = await Agent.findById(propertyInfo.agentId);
        if (!agent) {
          return res.status(404).send("Agent not found");
        }
        propertyInfo.agent = propertyInfo.agentId;
        delete propertyInfo.agentId;
      }
  
      if (propertyInfo.name) {
        propertyInfo.slug = await generateSlug(propertyInfo.name);
      }
  
      if (req.file) {
        propertyInfo.image = `/images/${req.file.filename}`;
      }
  
      const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        { $set: propertyInfo },
        { new: true }
      ).populate('agent');
  
      res.status(200).json(updatedProperty);
    } catch (err) {
      res.status(500).send("Property not updated: " + err);
    }
  });
  
  // Delete a property by ID
  app.delete("/deleteProperty/:id", async (req, res) => {
    try {
      const propertyId = req.params.id;
      const property = await Property.findById(propertyId);
  
      if (property && property.image) {
        const imagePath = path.join(__dirname, `../${property.image}`);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the image from the server
        }
      }
  
      await Property.deleteOne({ _id: propertyId });
      res.status(200).send("Property deleted successfully");
    } catch (err) {
      res.status(500).send("Property not deleted: " + err);
    }
  });
  
  module.exports = app;