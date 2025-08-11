import { Router } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure multer for S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
      cb(null, `media/${fileName}`);
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
    fileSize: 500 * 1024 * 1024 // 500MB limit - reasonable for most websites
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// Single file upload endpoint
router.post('/single', upload.single('media'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const cloudFrontUrl = process.env.CLOUDFRONT_DOMAIN 
      ? `https://${process.env.CLOUDFRONT_DOMAIN}/${req.file.key}`
      : req.file.location;

    res.json({
      message: 'File uploaded successfully',
      fileUrl: cloudFrontUrl,
      s3Url: req.file.location,
      fileName: req.file.key,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Multiple files upload endpoint
router.post('/multiple', upload.array('media', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => {
      const cloudFrontUrl = process.env.CLOUDFRONT_DOMAIN
        ? `https://${process.env.CLOUDFRONT_DOMAIN}/${file.key}`
        : file.location;

      return {
        fileUrl: cloudFrontUrl,
        s3Url: file.location,
        fileName: file.key,
        fileSize: file.size,
        mimeType: file.mimetype
      };
    });

    res.json({
      message: `${req.files.length} files uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file endpoint
router.delete('/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `media/${fileName}`
    };

    await s3.deleteObject(deleteParams).promise();
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;