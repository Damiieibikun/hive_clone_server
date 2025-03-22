const multer = require('multer');
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
        'image/gif',
        'image/svg+xml'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Only image files are allowed!'), false); 
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});

module.exports = upload;