const fs = require('fs');

const svg = fs.readFileSync('test-plain-download.png');
console.log(svg.toString('utf8').substring(0, 50));
