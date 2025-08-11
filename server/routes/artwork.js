import { Router } from "express";
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';
import Artwork from "../models/Artwork.js";

const router = Router();

// Configure multer for artwork uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
      cb(null, `artwork/${fileName}`);
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
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// Get all artworks
router.get("/", async (req, res) => {
  try {
    const artworkList = await Artwork.find().sort({ createdAt: -1 });
    res.status(200).json(artworkList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new artwork with file upload
router.post("/", upload.single('media'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "Media file is required" });
    }
    
    // Generate CloudFront URL
    const imageUrl = process.env.CLOUDFRONT_DOMAIN 
      ? `https://${process.env.CLOUDFRONT_DOMAIN}/${req.file.key}`
      : req.file.location;
    
    const newArtwork = new Artwork({ 
      title, 
      description, 
      category, 
      imageUrl 
    });
    
    const savedArtwork = await newArtwork.save();
    
    res.status(201).json({
      ...savedArtwork.toObject(),
      uploadInfo: {
        fileName: req.file.key,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create artwork without file upload (for existing images)
router.post("/no-upload", async (req, res) => {
  try {
    const { title, description, category, imageUrl } = req.body;
    
    if (!title || !description || !category || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const newArtwork = new Artwork({ title, description, category, imageUrl });
    const savedArtwork = await newArtwork.save();
    res.status(201).json(savedArtwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artwork by ID
router.get("/:id", async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    res.status(200).json(artwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update artwork
router.put("/:id", async (req, res) => {
  try {
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    res.status(200).json(updatedArtwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete artwork
router.delete("/:id", async (req, res) => {
  try {
    const deletedArtwork = await Artwork.findByIdAndDelete(req.params.id);
    if (!deletedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    res.status(200).json({ message: "Artwork deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all artworks
router.delete("/", async (req, res) => {
  try {
    const result = await Artwork.deleteMany({});
    res.status(200).json({ 
      message: `Deleted ${result.deletedCount} artworks successfully` 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;