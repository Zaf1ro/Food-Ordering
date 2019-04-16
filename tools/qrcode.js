const qr = require('qr-image');
const fs = require('fs');

const createQrCode = (url) => {
    let qr_png = qr.image(url, { type: 'png' });
    qr_png.pipe(fs.createWriteStream('123.png'));
};


module.exports = {
    createQrCode
};