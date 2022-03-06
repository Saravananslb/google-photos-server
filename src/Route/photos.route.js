const express = require('express');
const { insertPhoto, getPhoto, updatePhoto, insertAlbum, editAlbum } = require('../Controller/photos.controller');

const router = express.Router();

router.post('/new', insertPhoto);
router.get('/get', getPhoto);
router.put('/edit', updatePhoto);
router.post('/add-album', insertAlbum);
router.put('/update-album', editAlbum);

module.exports = router;