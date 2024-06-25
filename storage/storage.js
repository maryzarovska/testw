const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET
// });

cloudinary.config({
    cloud_name: 'drbf33hlu',
    api_key: '125939535447922',
    api_secret: 'E_79ofUzVD4lkk-rymzsKj-49hw'
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'testw',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    }
});

module.exports = {
    storage
};