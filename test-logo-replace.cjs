const fs = require('fs');

const twitter = fs.readFileSync('public/logos/twitter.svg');
const facebook = fs.readFileSync('public/logos/facebook.svg');
const github = fs.readFileSync('public/logos/github.svg');
const youtube = fs.readFileSync('public/logos/youtube.svg');

let content = fs.readFileSync('src/components/qr-maker-sections/design-section.tsx', 'utf8');

content = content.replace('"/logos/twitter.svg"', '"data:image/svg+xml;base64,' + twitter.toString('base64') + '"');
content = content.replace('"/logos/facebook.svg"', '"data:image/svg+xml;base64,' + facebook.toString('base64') + '"');
content = content.replace('"/logos/github.svg"', '"data:image/svg+xml;base64,' + github.toString('base64') + '"');
content = content.replace('"/logos/youtube.svg"', '"data:image/svg+xml;base64,' + youtube.toString('base64') + '"');

fs.writeFileSync('src/components/qr-maker-sections/design-section.tsx', content);
