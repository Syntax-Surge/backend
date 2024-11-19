const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Categories',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }
  res.status(200).json({ url: req.file.path });
};

module.exports = { upload, uploadImage };
