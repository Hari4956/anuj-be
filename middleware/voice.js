const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');  // your configured cloudinary instance

const allowedMimeTypes = [
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/x-m4a',
  'audio/webm',
  'audio/ogg',
  'audio/x-ms-wma',
  'audio/aac',
  'video/mpeg',           // ✅ Add this
  'application/octet-stream' // optional fallback
];


const fileFilter = (req, file, cb) => {
  console.log("Uploaded file:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'voice_records',
    resource_type: 'auto',
    public_id: `voice_${Date.now()}`,
  }),
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

module.exports = upload;
