import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

// A simple script to write out a section of the canvas to see if it's drawing correctly.
async function verifyRender(path) {
  const image = await loadImage(path);
  console.log(`Image bounds: ${image.width}x${image.height}`);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  // write back out to see if it read ok
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('test-plain-reencoded.png', buffer);
  console.log("reencoded image");
}

(async () => {
    await verifyRender('test-plain-download.png');
})();
