import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import jsQR from 'jsqr';

async function readImage(path) {
  const image = await loadImage(path);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  return {
      data: imageData.data,
      width: image.width,
      height: image.height
  };
}

(async () => {
    const png = await readImage('test-plain-download.png');
    const code = jsQR(png.data, png.width, png.height);
    if (code) {
        console.log("QR Data:", code.data);
    } else {
        console.log("Failed to parse.");
    }
})();
