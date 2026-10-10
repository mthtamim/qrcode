const fs = require('fs');
console.log(fs.readFileSync('src/components/custom-qr-renderer.tsx', 'utf8').indexOf('d={`M${x},${y}h${w}v${w}h-${w}Z M${x + cellSize},${y + cellSize}h${w - 2 * cellSize}v${w - 2 * cellSize}h-${w - 2 * cellSize}Z`}'));
