# QRReader

### library for reading QR codes from the webcam

Ready for usage in PWA, SPA (Angular, React, Vue, etc).
 
Compliled size: 5kB.

3rd party dependency: jsqr (<https://github.com/cozmo/jsQR>), size: 254Kb.

## Methods

```javascript
  isMediaStreamAPISupported(): boolean
```

```javascript
  getVideoInputDevices(): Promise<MediaDeviceInfo[]>
```

```javascript
  startCapture(video: HTMLElement, captureInterval?: number): Promise<string>
```

```javascript
  stopCapture(): void
```

```javascript
  stopAndSwitchCamera(): void
```

## Usage Example 

```javascript

// import
import QRReader from 'QRReader';

// init
const qrCodeReader = new QRReader();
const videoElement = document.getElementById('video');

// start Capture
start() {
  qrCodeReader.startCapture(videoElement)
    .then(decodedData => {
      console.log(decodedData);
    })
    .catch(console.log);
}

// cancel Capture
onCancelClick() {
  qrCodeReader.stopCapture();
}

// switch input device
switchCamera() {
  qrCodeReader.stopAndSwitchCamera();
}
```
