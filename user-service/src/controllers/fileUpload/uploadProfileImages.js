const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('../../config/cloudinaryConfig')

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Profile',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

const uploadProfileImage = async(req, res) => {
  const imageUrls = [];
  console.log('Uploading profile image')
  // console.log(req);
  console.log('Uploaded file:', req.file);
  
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }
  res.status(200).json({ url: req.file.path ,imageUrls});
};

module.exports = { upload, uploadProfileImage };
