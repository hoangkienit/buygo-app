const multer = require('multer');
const path = require('path');

class UploadMiddleware {
  static upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save to the "uploads" folder
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get file extension
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, filename);
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only JPG, JPEG, and PNG images are allowed!'), false);
      }
      cb(null, true);
    },
  });
}

module.exports = UploadMiddleware;
