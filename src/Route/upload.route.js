const express = require('express');
const multer = require('multer');

// const PATH = require('../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
 });
 
 const upload = multer({ storage: storage });

const router = express.Router();

router.post('/image', upload.single('image'), (req, res) => {
    try {
    const image = req.file.filename;
    res.json({ status: true, message: 'File uploaded successfully.', image: `\\${image}`});
    return;
    }
    catch (error) {
        console.log(error);
        res.json({ status: false, message: 'Failed to uploaded file' });
        return;
    }
})

module.exports = router;