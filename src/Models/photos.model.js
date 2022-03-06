const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    imagePath : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isFavorite: {
        type: Array
    },
    isTrash: {
        type: Boolean,
        default: false
    },
    archive: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('photos', photoSchema);