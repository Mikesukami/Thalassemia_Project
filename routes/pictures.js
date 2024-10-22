const express = require('express');
const multer = require('multer');
const db = require('../util/db.config');
const path = require('path');
const moment = require('moment');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();
const Media = db.media;
const User = db.user;
const Predict = db.predict;

// Multer storage configuration
const memoryStorage = multer.memoryStorage(); // For in-memory buffer storage (used in prediction)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for file storage
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name; // Get the original name of the file
    const fileExt = path.extname(file.originalname); // Get file extension
    const date = moment().format('D-M-YYYY'); // Format date
    const newFileName = `${originalName}-${date}${fileExt}`; // Create new filename with date
    cb(null, newFileName); // Set the new file name
  }
});

// Configure multer for disk storage (for general uploads)
const uploadDisk = multer({ storage: diskStorage });
// Configure multer for memory storage (for prediction)
const uploadMemory = multer({ storage: memoryStorage });

// Route for single image upload
router.post('/upload', uploadDisk.single('image'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const fileName = req.file.filename;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;
    const fileUrl = `uploads/${fileName}`; // File URL

    // Create a media entry in the database
    await Media.create({
      userId: userId,
      fileName: fileName,
      fileType: fileType,
      fileSize: fileSize,
      fileUrl: fileUrl
    });

    return res.status(200).json({
      status: 200,
      message: "Image uploaded successfully!"
    });
  } catch (error) {
    console.error('Error during image upload:', error);
    return res.status(500).json({ error: "An error occurred while uploading the image" });
  }
});

// Route for multiple image upload
router.post('/upload-multiple', uploadDisk.array('images'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const uploadedFiles = req.files;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const mediaEntries = uploadedFiles.map(file => ({
      userId: userId,
      fileName: file.filename,
      fileType: file.mimetype,
      fileSize: file.size,
      fileUrl: `uploads/${file.filename}`
    }));

    // Bulk create entries in the media table
    await Media.bulkCreate(mediaEntries);

    return res.status(200).json({
      status: 200,
      message: "Images uploaded successfully!"
    });
  } catch (error) {
    console.error('Error during multiple image upload:', error);
    return res.status(500).json({ error: "An error occurred while uploading the images" });
  }
});

// Route to get images by user
router.post('/get-images-by-user', async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const images = await Media.findAll({
      where: { userId: userId }
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ error: "No images found for this user" });
    }

    return res.status(200).json({
      status: 200,
      message: "Images retrieved successfully!",
      data: images
    });
  } catch (error) {
    console.error('Error retrieving images:', error);
    return res.status(500).json({ error: "An error occurred while retrieving images" });
  }
});

// Function to call Python service for prediction
const predictWithPython = async (imageBuffer, userId, originalName) => {
  const formData = new FormData();

  console.log('Predicting with Python service...');
  console.log('User ID:', userId);
  console.log('Original name:', originalName);

  if (!originalName) {
    console.error("Original name is undefined. Using default name.");
    originalName = 'image.png'; // Default name
  }

  formData.append('image', imageBuffer, originalName); // Append image buffer with filename
  formData.append('userId', userId); // Append userId

  try {
    const response = await axios.post('http://localhost:5000/predict', formData, {
      headers: {
        ...formData.getHeaders(), // Set headers
      },
    });
    return response.data; // Return prediction data
  } catch (error) {
    console.error('Error calling Python prediction service:', error);
    throw error;
  }
};

// Predict route using memory storage
router.post('/predict', uploadMemory.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const userId = req.body.userId;
    const imageBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    // Create form data to send to Flask API
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('image', imageBuffer, {
      filename: originalName,
      contentType: req.file.mimetype,
    });

    // Send image to Flask API for prediction
    const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    });

    const predictionData = response.data;

    // Store image details in media table
    const media = await Media.create({
      userId: userId,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: `uploads/${req.file.originalname}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Store prediction result in predict table
    const predict = await Predict.create({
      mediaId: media.mediaId,
      userId: userId,
      prediction: predictionData.prediction,
      modelUsed: 'Model used details', // Add if needed
      confidence: 'Confidence details', // Add if needed
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(200).json({
      status: 200,
      message: 'Prediction successful!',
      prediction: predictionData.prediction,
      mediaId: media.mediaId,
      predictId: predict.predictId,
      confidence: predictionData.confidence, // If returned from Python API
    });
  } catch (error) {
    console.error('Error during prediction:', error);
    return res.status(500).json({ error: 'An error occurred during prediction' });
  }
});

module.exports = router;
