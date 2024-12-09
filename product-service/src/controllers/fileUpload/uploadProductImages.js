const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('../../config/cloudinaryConfig')

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

const uploadProductImage = async(req, res) => {
  const imageUrls = [];
  console.log('Uploading product image')
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }
  res.status(200).json({ url: req.file.path ,imageUrls});
};

module.exports = { upload, uploadProductImage };
