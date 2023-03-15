const pdf2img = require('pdf-img-convert');
const jsQR = require("jsqr");
const { PNG } = require('pngjs');
const Jimp = require("jimp");

(async () => {
    const output = await pdf2img.convert('./fatura.pdf', {
        scale: 3,
        base64: true
    });

    const firstPage = output[0];

    const buffer = Buffer.from(firstPage, 'base64');

    const jimpImage = await Jimp.read(buffer);
    const editedImage = jimpImage.crop(1500, 2050, jimpImage.getWidth() - 1500, 300);
    const editedBuffer = await editedImage.getBufferAsync(Jimp.MIME_PNG);
    
    require('fs').writeFileSync('output.png', editedBuffer);
    
    const png = PNG.sync.read(editedBuffer);
    const code = jsQR(png.data, png.width, png.height);

    console.log(code.data);

})()