# QRReader

3rd party dependency: jsqr (<https://github.com/cozmo/jsQR>), size: 254Kb.

## Usage

```javascript

// import
import QRReader from 'QRReader';

// init
const qRreader = new QRReader();
const el = document.getElementById('videoCapture');

// start Capture
start() {
  qr.startCapture(el)
    .then(console.log)
    .catch(console.log);
}

// cancel Capture
onCancelClick() {
  qr.stopCapture();
}
```
