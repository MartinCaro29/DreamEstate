let express = require('express');
let Property = require('../models/propertyModel'); // Import your Property schema
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
        name, address, coordX, coordY, price, beds, baths, area, category, status, sell_type
      } = req.body;
  
      // Convert string fields to numbers
      const parsedCoordX = parseFloat(coordX);
      const parsedCoordY = parseFloat(coordY);
      const parsedPrice = parseFloat(price);
      const parsedBeds = parseInt(beds);
      const parsedBaths = parseInt(baths);
      const parsedArea = parseInt(area);  // Parse the area as an integer
  
      if (
        !name || !address || isNaN(parsedCoordX) || isNaN(parsedCoordY) || isNaN(parsedPrice) ||
        isNaN(parsedBeds) || isNaN(parsedBaths) || isNaN(parsedArea) || !category || !sell_type || !req.file
      ) {
        console.log('Request body:', req.body);  // Log the request body for debugging
        console.log('File:', req.file);          // Log the file info for debugging
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
        area: parsedArea,  // Store the area as a number
        category,
        status,
        sell_type,
        slug,
        image: `/Images/${req.file.filename}`
      });
  
      await newProperty.save();
      res.status(200).send("Property added successfully");
    } catch (err) {
      res.status(500).send("Property not added: " + err);
    }
  });
  
  
  
  // Get all properties
  app.get("/getAllProperties", async (req, res) => {
    try {
      // Fetch all properties where the status is not 'e shitur'
      let properties = await Property.find({ status: { $ne: 'e shitur' } });
      res.status(200).json(properties);
    } catch (err) {
      res.status(500).send("Gabim gjate marrjes se pronave!");
    }
  });
  
  // Get a single property by ID
  app.get("/getOneProperty/:id", async (req, res) => {
    try {
      const propertyId = req.params.id;
  
      // Fetch the property by ID, ensuring the status is not 'e shitur'
      let property = await Property.findOne({ _id: propertyId, status: { $ne: 'e shitur' } });
  
      if (!property) {
        return res.status(404).send("Prona nuk gjendet ose eshte shitur!");
      }
  
      res.status(200).json(property);
    } catch (err) {
      res.status(500).send("Error fetching property " + req.params.id);
    }
  });
  
  // Update a property by ID
  app.patch("/updateProperty/:id", upload.single('image'), async (req, res) => {
    try {
      const propertyId = req.params.id;
      const propertyInfo = { ...req.body };
  
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
      );
  
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