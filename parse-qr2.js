import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import jsQR from 'jsqr';

(async () => {
    const png = await loadImage('test-frame-download.png');
    const canvas = createCanvas(png.width, png.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(png, 0, 0);
    const imageData = ctx.getImageData(0, 0, png.width, png.height);

    const code = jsQR(imageData.data, png.width, png.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      console.log("Found QR code", code.data);
    } else {
      console.log("No QR code found.");
    }
})();
