import { Router } from "express";
import multer from 'multer';
import exifReader from 'exif-reader';

const router = Router();

// Configure multer for temporary file upload (just for metadata extraction)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Extract photo metadata (especially date taken)
router.post("/extract", upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo provided" });
    }

    const buffer = req.file.buffer;
    let metadata = {
      dateTaken: null,
      location: null,
      hasMetadata: false
    };

    try {
      // Look for EXIF data in the buffer
      const exifIndex = buffer.indexOf(Buffer.from([0xFF, 0xE1])); // EXIF marker
      if (exifIndex !== -1) {
        // Find the EXIF data section
        const exifStart = exifIndex + 4; // Skip marker and length
        const exifLength = buffer.readUInt16BE(exifIndex + 2);
        
        if (exifStart + exifLength <= buffer.length) {
          const exifBuffer = buffer.slice(exifStart + 6, exifStart + exifLength); // Skip EXIF header
          
          if (exifBuffer.length > 8) {
            const exif = exifReader(exifBuffer);
            metadata.hasMetadata = true;
            
            // Extract date taken
            if (exif.exif && exif.exif.DateTimeOriginal) {
              const dateStr = exif.exif.DateTimeOriginal;
              // EXIF date format is "YYYY:MM:DD HH:MM:SS"
              const formattedDate = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
              metadata.dateTaken = new Date(formattedDate).toISOString();
            } else if (exif.exif && exif.exif.DateTime) {
              const dateStr = exif.exif.DateTime;
              const formattedDate = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
              metadata.dateTaken = new Date(formattedDate).toISOString();
            }
            
            // Extract GPS location if available
            if (exif.gps && exif.gps.GPSLatitude && exif.gps.GPSLongitude) {
              const lat = convertDMSToDD(exif.gps.GPSLatitude, exif.gps.GPSLatitudeRef);
              const lng = convertDMSToDD(exif.gps.GPSLongitude, exif.gps.GPSLongitudeRef);
              metadata.location = { lat, lng };
            }
            
          }
        }
      }
    } catch (exifError) {
      console.log('EXIF extraction failed, trying alternative method:', exifError.message);
      
      // Fallback: use file modification time if available
      if (req.file.originalname) {
        // File creation date fallback - not ideal but better than nothing
        metadata.dateTaken = new Date().toISOString();
        metadata.hasMetadata = false;
      }
    }

    // If no date found in EXIF, use current date as fallback
    if (!metadata.dateTaken) {
      metadata.dateTaken = new Date().toISOString();
    }

    res.status(200).json({
      success: true,
      metadata: metadata,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });

  } catch (error) {
    console.error('Error extracting photo metadata:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to extract photo metadata',
      error: error.message 
    });
  }
});

// Helper function to convert DMS (Degrees, Minutes, Seconds) to Decimal Degrees
function convertDMSToDD(dms, ref) {
  if (!dms || dms.length !== 3) return null;
  
  let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
  if (ref === 'S' || ref === 'W') dd = dd * -1;
  return dd;
}

export default router;