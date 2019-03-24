# QRReader

3rd party dependency: jsqr (<https://github.com/cozmo/jsQR>), size: 254Kb.

## Usage

```javascript

// import
import QRReader from 'QRReader';

// init
const qrCodeReader = new QRReader();
const videoElement = document.getElementById('video');

// start Capture
start() {
  qrCodeReader.startCapture(videoElement)
    .then(console.log)
    .catch(console.log);
}

// cancel Capture
onCancelClick() {
  qrCodeReader.stopCapture();
}
```
