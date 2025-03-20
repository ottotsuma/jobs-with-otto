// import { useState } from 'react';
// import QRCode from 'qrcode.react';
// // https://youtu.be/74zwJzCTNBE

// function LocationQRCode({ locationId }) {
//     const [qrDataUrl, setQrDataUrl] = useState('');

//     const generateQRCode = () => {
//         const qrCodeCanvas = document.getElementById(`qrcode-${locationId}`);
//         const dataUrl = qrCodeCanvas.toDataURL('image/png');
//         setQrDataUrl(dataUrl);
//     };

//     return (
//         <div>
//             <QRCode id={`qrcode-${locationId}`} value={locationId} />
//             <button onClick={generateQRCode}>Generate QR Code</button>
//             {qrDataUrl && <img src={qrDataUrl} alt="QR Code" />}
//         </div>
//     );
// }
