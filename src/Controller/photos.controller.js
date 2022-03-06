const { createPhoto, getPhotos, updatePhotos, createAlbum, updateAlbum } = require('../Service/photos.service');

const insertPhoto = async(req, res) => {
    try{
        const userId = res.locals.userId;
        const body = req.body;
        const photo = await createPhoto(body, userId);
        res.send(photo);
    }
    catch (error) {
        res.send(error);
    }
};

const getPhoto = async(req, res) => {
    try{
        const userId = res.locals.userId;
        const { type } = req.query;
        const photo = await getPhotos(userId, type);
        res.send(photo);
    }
    catch (error) {
        res.send(error);
    }
};

const updatePhoto = async(req, res) => {
    try{
        const userId = res.locals.userId;
        const body = req.body;
        if (!body) {
            res.json({ status: false, message: 'updated field is required' });
            return;
        }
        const photo = await updatePhotos(userId, body);
        res.send({status: true, photo});
    }
    catch (error) {
        res.send({ status: false, error });
    }
};


const editAlbum = async(req, res) => {
    try{
        const userId = res.locals.userId;
        const body = req.body;
        if (!body) {
            res.json({ status: false, message: 'updated field is required' });
            return;
        }
        const album = await updateAlbum(userId, body);
        res.send({status: true, album});
    }
    catch (error) {
        res.send({ status: false, error });
    }
};

const insertAlbum = async(req, res) => {
    try{
        const userId = res.locals.userId;
        const { name } = req.body;
        const album = await createAlbum(userId, name);
        res.send({ status: true, album, message: 'Album created successfully' });
    }
    catch (error) {
        res.send({status: false, error});
    }
};


module.exports = {
    insertPhoto,
    getPhoto,
    updatePhoto,
    insertAlbum,
    editAlbum
}