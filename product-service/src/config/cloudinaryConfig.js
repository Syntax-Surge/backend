const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: 'ddevwsadh',
  api_key: '912195186428862',
  api_secret: 'nDq0vzZnqZCDEwNOwi6d3NXvmXQ',
});

module.exports = cloudinary;
