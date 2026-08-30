const multer = require('multer');
const AppError = require('../utils/AppError');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const safeName = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 80);

    cb(null, `${Date.now()}-${safeName}${path.extname(file.originalname)}`);
  }
});

function pdfFileFilter(req, file, cb) {
  if (file.fieldname === 'bookFile' && file.mimetype === 'application/pdf') {
    cb(null, true);
    return;
  }

  if (file.fieldname === 'coverImage' && file.mimetype.startsWith('image/')) {
    cb(null, true);
    return;
  }

  if (file.fieldname === 'bookFile') {
    cb(new AppError('Only PDF files are allowed', 400));
    return;
  }

  cb(new AppError('Only image files are allowed for covers', 400));
}

const uploadBookFiles = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
}).fields([
  { name: 'bookFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

module.exports = {
  uploadBookFiles
};