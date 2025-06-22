// verify-cloudinary.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// console.log('Current Configuration:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET ? '*****' : 'present'
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// cloudinary.api.ping()
//   .then(() => console.log('✅ Successfully connected to Cloudinary'))
//   .catch(err => {
//     console.error('❌ Connection failed:', err.message);
//     console.log('Please verify:');
//     console.log('1. Your credentials in Cloudinary Dashboard');
//     console.log('2. Your .env file matches exactly');
//     console.log('3. There are no typos or extra spaces');
//   });

module.exports = cloudinary;