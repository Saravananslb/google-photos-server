const { readFileSync } = require('fs');

// function to encode file data to base64 encoded string
const base64_encode = (file) => {
    // read binary data
    var bitmap = readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
module.exports = base64_encode;
