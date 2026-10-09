import qrcode from 'qrcode';
const qrc = qrcode.create('hello', { errorCorrectionLevel: 'M' });
console.log(qrc.modules.size);
console.log(qrc.modules.data.slice(0, 10));
