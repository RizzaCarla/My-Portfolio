import { Router } from "express";
import multer from 'multer';
import multerS3 from 'multer-s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3 from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';
import Travel from "../models/Travel.js";

const router = Router();

// Helper function to extract S3 key from image URL
function getS3KeyFromUrl(imageUrl) {
  try {
    if (imageUrl.includes('media.rizzacarla.com')) {
      // CloudFront URL format: https://media.rizzacarla.com/travel/filename.jpg
      return imageUrl.replace('https://media.rizzacarla.com/', '');
    } else if (imageUrl.includes('.s3.')) {
      // Direct S3 URL format: https://bucket.s3.region.amazonaws.com/travel/filename.jpg
      const url = new URL(imageUrl);
      return url.pathname.substring(1); // Remove leading slash
    }
    return null;
  } catch (error) {
    console.error('Error extracting S3 key from URL:', error);
    return null;
  }
}

// Helper function to delete file from S3
async function deleteFileFromS3(imageUrl) {
  const key = getS3KeyFromUrl(imageUrl);
  if (!key) {
    console.warn('Could not extract S3 key from URL:', imageUrl);
    return false;
  }

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key
    });

    await s3.send(deleteCommand);
    console.log('Successfully deleted file from S3:', key);
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
}

// Configure multer for travel photo uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
      cb(null, `travel/${fileName}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname
      });
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for photos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all travel entries
router.get("/", async (req, res) => {
  try {
    const travelList = await Travel.find().sort({ startDate: -1 });
    res.status(200).json(travelList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current travel status
router.get("/current", async (req, res) => {
  try {
    const currentTravel = await Travel.findOne({ 
      isCurrentlyTraveling: true 
    }).sort({ startDate: -1 });
    
    res.status(200).json(currentTravel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new travel entry with photo upload
router.post("/", upload.single('photo'), async (req, res) => {
  try {
    const isCurrentlyTraveling = req.body.isCurrentlyTraveling === 'true';
    
    // If setting as currently traveling, clear other currently traveling entries
    if (isCurrentlyTraveling) {
      await Travel.updateMany(
        { isCurrentlyTraveling: true },
        { $set: { isCurrentlyTraveling: false, currentTravelStatus: 'completed' } }
      );
    }

    const travelData = {
      location: req.body.location,
      country: req.body.country,
      landmark: req.body.landmark,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      companions: req.body.companions ? JSON.parse(req.body.companions) : [],
      lat: req.body.lat ? parseFloat(req.body.lat) : null,
      lng: req.body.lng ? parseFloat(req.body.lng) : null,
      photoDateTaken: req.body.photoDateTaken ? new Date(req.body.photoDateTaken) : null,
      isCurrentlyTraveling: isCurrentlyTraveling,
      currentTravelStatus: req.body.currentTravelStatus || 'completed'
    };

    // Add photo URL if uploaded
    if (req.file) {
      travelData.photo = `https://media.rizzacarla.com/${req.file.key}`;
    }

    const newTravel = new Travel(travelData);
    await newTravel.save();
    
    res.status(201).json(newTravel);
  } catch (error) {
    console.error('Error creating travel entry:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update travel entry
router.put("/:id", upload.single('photo'), async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) {
      return res.status(404).json({ message: "Travel entry not found" });
    }

    const isCurrentlyTraveling = req.body.isCurrentlyTraveling === 'true';
    
    // If setting as currently traveling, clear other currently traveling entries
    if (isCurrentlyTraveling) {
      await Travel.updateMany(
        { isCurrentlyTraveling: true, _id: { $ne: req.params.id } },
        { $set: { isCurrentlyTraveling: false, currentTravelStatus: 'completed' } }
      );
    }

    const travelData = {
      location: req.body.location,
      country: req.body.country,
      landmark: req.body.landmark,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      companions: req.body.companions ? JSON.parse(req.body.companions) : [],
      lat: req.body.lat ? parseFloat(req.body.lat) : null,
      lng: req.body.lng ? parseFloat(req.body.lng) : null,
      photoDateTaken: req.body.photoDateTaken ? new Date(req.body.photoDateTaken) : null,
      isCurrentlyTraveling: isCurrentlyTraveling,
      currentTravelStatus: req.body.currentTravelStatus || 'completed'
    };

    // Handle photo update
    if (req.file) {
      // Delete old photo if exists
      if (travel.photo) {
        await deleteFileFromS3(travel.photo);
      }
      // Add new photo URL
      travelData.photo = `https://media.rizzacarla.com/${req.file.key}`;
    } else if (req.body.removePhoto === 'true') {
      // Remove photo if requested
      if (travel.photo) {
        await deleteFileFromS3(travel.photo);
      }
      travelData.photo = '';
    } else {
      // Keep existing photo
      travelData.photo = travel.photo;
    }

    const updatedTravel = await Travel.findByIdAndUpdate(
      req.params.id,
      travelData,
      { new: true }
    );

    res.status(200).json(updatedTravel);
  } catch (error) {
    console.error('Error updating travel entry:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete travel entry
router.delete("/:id", async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) {
      return res.status(404).json({ message: "Travel entry not found" });
    }

    // Delete associated photo from S3
    if (travel.photo) {
      await deleteFileFromS3(travel.photo);
    }

    await Travel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Travel entry deleted successfully" });
  } catch (error) {
    console.error('Error deleting travel entry:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;