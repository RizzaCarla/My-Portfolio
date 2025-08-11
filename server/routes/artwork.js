import { Router } from "express";
import multer from 'multer';
import multerS3 from 'multer-s3';
import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3 from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';
import Artwork from "../models/Artwork.js";

const router = Router();

// Helper function to extract S3 key from image URL
function getS3KeyFromUrl(imageUrl) {
  try {
    if (imageUrl.includes('media.rizzacarla.com')) {
      // CloudFront URL format: https://media.rizzacarla.com/artwork/filename.jpg
      return imageUrl.replace('https://media.rizzacarla.com/', '');
    } else if (imageUrl.includes('.s3.')) {
      // Direct S3 URL format: https://bucket.s3.region.amazonaws.com/artwork/filename.jpg
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
    // Removed ACL setting since bucket blocks ACLs
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

// Middleware to handle multer errors
function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum 500MB allowed.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Invalid file field. Expected field name "media".' });
    }
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}

// Create new artwork with file upload
router.post("/", upload.single('media'), handleMulterError, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    
    if (!['painting', 'ceramic', 'embroidery'].includes(category)) {
      return res.status(400).json({ message: "Invalid category. Must be: painting, ceramic, or embroidery" });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "Media file is required" });
    }
    
    // Generate image URL - prefer direct S3 URL for now
    const imageUrl = req.file.location;
    
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
    console.error('Artwork creation error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    // Handle specific AWS S3 errors
    if (error.code === 'NetworkingError') {
      return res.status(500).json({ message: 'Network error during upload. Please try again.' });
    }
    
    if (error.code === 'InvalidAccessKeyId' || error.code === 'SignatureDoesNotMatch') {
      return res.status(500).json({ message: 'AWS credentials error. Please contact administrator.' });
    }
    
    if (error.code === 'NoSuchBucket') {
      return res.status(500).json({ message: 'Storage bucket not found. Please contact administrator.' });
    }
    
    if (error.code === 'AccessDenied') {
      return res.status(500).json({ message: 'Storage access denied. Please contact administrator.' });
    }
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum 500MB allowed.' });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Invalid file field name. Expected "media".' });
    }
    
    // Generic error
    res.status(500).json({ 
      message: 'Failed to create artwork. Please try again.' 
    });
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
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // Delete the associated file from S3
    if (artwork.imageUrl) {
      const deleteSuccess = await deleteFileFromS3(artwork.imageUrl);
      if (!deleteSuccess) {
        console.warn(`Failed to delete S3 file for artwork ${artwork._id}, but continuing with database deletion`);
      }
    }

    // Delete from database
    await Artwork.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      message: "Artwork and associated file deleted successfully" 
    });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete all artworks
router.delete("/", async (req, res) => {
  try {
    // Get all artworks first to delete their files
    const artworks = await Artwork.find({});
    
    // Delete all associated files from S3
    let filesDeleted = 0;
    for (const artwork of artworks) {
      if (artwork.imageUrl) {
        const deleteSuccess = await deleteFileFromS3(artwork.imageUrl);
        if (deleteSuccess) {
          filesDeleted++;
        }
      }
    }
    
    // Delete all from database
    const result = await Artwork.deleteMany({});
    
    res.status(200).json({ 
      message: `Deleted ${result.deletedCount} artworks and ${filesDeleted} associated files successfully` 
    });
  } catch (error) {
    console.error('Error deleting all artworks:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;