const res = require('express/lib/response');
const photModel = require('../Models/photos.model');
const albumModel = require('../Models/album.model');
const path = __dirname.replace('src\\Service', 'uploads');
const base64_encode = require('../Utils/readFile');

const createPhoto = async(body, userId) => {
    const create = new photModel({
        ...body, userId: userId
    });
    const photo = await create.save();
    return photo._doc;
}

const getPhotos = async(userId, type='photos') => {
    const photoObj = {};
    let photos;
    if (type === 'photos')
        photos = await photModel.find({ userId, isTrash: false, archive: false });
    else if (type === 'trash')
        photos = await photModel.find({ userId, isTrash: true });
    else if (type === 'favorites')
        photos = await photModel.find({ userId, isTrash: false, isFavorite: userId });
    else if (type === 'archive')
        photos = await photModel.find({ userId, archive: true });
    if (photos) {
        photos.map(item => {
            const image = path + item.imagePath;
            if (photoObj[item.createdAt.toISOString().split('T')[0]]) {
                photoObj[item.createdAt.toISOString().split('T')[0]].photos.push({id: item._id, imagebs4: base64_encode(image), favorite: item.isFavorite.includes(userId), archive: item.archive})
            }
            else {
                photoObj[item.createdAt.toISOString().split('T')[0]] = {
                    createdAt: item.createdAt.toISOString().split('T')[0],
                    photos: [{id: item._id, imagebs4: base64_encode(image), favorite: item.isFavorite.includes(userId), archive: item.archive}]
                }
            }
        })
        // console.log(Object.values(photoObj)[0].photos)
        return Object.values(photoObj)
    }
    
    if (type === 'album') {
        let albumObj = {};
        const albumArr = [];
        photos = await photModel.find({ userId });
        const album = await albumModel.find({ createdBy: userId });
        console.log(photos,album)
        if (album) {
            album.map(elem => {
                albumObj = {};
                photos.map(item => {

                    if (elem.photos.includes(item._id)){
                        const image = path + item.imagePath;
                        if (albumObj[item.createdAt.toISOString().split('T')[0]]) {
                            photos.push({id: item._id, imagebs4: base64_encode(image), favorite: item.isFavorite.includes(userId)})
                        }
                        else {
                            albumObj[item.createdAt.toISOString().split('T')[0]] = {
                                createdAt: item.createdAt.toISOString().split('T')[0],
                                photos: [{id: item._id, imagebs4: base64_encode(image), favorite: item.isFavorite.includes(userId)}]
                            }
                        }
                    }
                })
                albumArr.push({ id: elem._id, name: elem.name,  photos: Object.values(albumObj)});
            })
            return albumArr;
        }
    }
}

const updatePhotos = async(userId, body) => {
    let updatedPhoto;
    const photo = await photModel.findById(body.id);
    if (body.favorite == true || body.favorite == false) {
        let isFavorite = [...photo.isFavorite];
        if (body.favorite) {
            if (!isFavorite.includes(userId))
                isFavorite.push(userId);
        }
        else {
            isFavorite = isFavorite.filter(item => item !== userId);
        }
        updatedPhoto = await photModel.findByIdAndUpdate(body.id, { isFavorite: isFavorite });
        return ({...photo._doc, isFavorite: body.favorite });
    }
    if (body.trash == true || body.trash == false) {
        updatedPhoto = await photModel.findOneAndUpdate({_id: body.id, userId: userId}, { isTrash: body.trash });
        return ({...photo._doc, ...body});
    }
    if (body.archive == true || body.archive == false) {
        updatedPhoto = await photModel.findOneAndUpdate({_id: body.id, userId: userId}, { archive: body.archive });
        return ({...photo._doc, ...body});
    }
}

const updateAlbum = async(userId, body) => {
    let update;
    if (body.photos) {
        let album = await albumModel.findById(body.id);
        if (body.add) {
            const photos = [...album.photos, ...body.photos];
            update = await albumModel.findByIdAndUpdate(body.id, {photos: photos})            
        }
        else {
            const photos = album.photos.filter(item => !body.photos.includes(item));
            update = await albumModel.findByIdAndUpdate(body.id, {photos: photos})  
        }
    }
    return update._doc;
}

const createAlbum = async(userId, albumName) => {
    const create = new albumModel({
        createdBy: userId,
        name: albumName
    })
    const created = await create.save();
    return created._doc;
}


module.exports = {
    createPhoto,
    getPhotos,
    updatePhotos,
    createAlbum,
    updateAlbum
}