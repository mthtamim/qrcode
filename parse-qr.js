import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import fs from 'fs';

const buffer = fs.readFileSync('test-twitter-logo-download.png');
const png = PNG.sync.read(buffer);

// Try increasing the margin slightly for jsQR parsing
const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height, {
  inversionAttempts: "dontInvert",
});

if (code) {
  console.log("Found QR code", code.data);
} else {
  console.log("No QR code found. It might be due to the logo blocking too much data for jsQR to decode (it handles up to level H depending on actual overlay size).");
}
