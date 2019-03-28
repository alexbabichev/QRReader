import jsQR, { QRCode } from 'jsqr';

enum ErrorMessage { 
  InvalidVideo = 'Invalid video element', 
  InvalidCtx = 'Internal error. No ctx created',
  NotAllowedError = 'User has denied access to camera',
  default = 'QRReader error occurred'
 };

class QRReader {

  private timout = 500;
  private intervalId: NodeJS.Timeout | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private constraints: MediaStreamConstraints = { audio: false, video: true };
  private mediaStream: MediaStream | null = null;
  private iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;

  public isMediaStreamAPISupported = navigator && navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices;

  constructor() {
    this.setConstraints();

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.setCanvasProperties(this.canvas);
  }

  private setCanvasProperties(canvas: HTMLCanvasElement): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private setConstraints(): void {
    this.getVideoInputDevice().
      then(device => {
        if (device)
          this.constraints.video = {
            deviceId: device.deviceId,
            facingMode: this.iOS ? 'environment' : undefined
          }
      });
  }

  private setVideoPlayback(video: HTMLVideoElement, stream: MediaStream): void {
    video.setAttribute('playsinline', 'true');
    video.srcObject = stream;
    video.play();
  }

  private getVideoInputDevice(): Promise<MediaDeviceInfo | undefined> {
    return navigator.mediaDevices
      .enumerateDevices()
      .then((devices: MediaDeviceInfo[]) => {
        const videoInputDevices = devices
          .filter((device: MediaDeviceInfo) => {
            return device.kind === 'videoinput';
          });
        return videoInputDevices[0];
      });
  }

  private getFrame(video: HTMLVideoElement, ctx: CanvasRenderingContext2D): Uint8ClampedArray {
    ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
    return ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
  }

  private getQRString(video: HTMLVideoElement, ctx: CanvasRenderingContext2D): string {
    const result = jsQR(this.getFrame(video, ctx), this.canvas.width, this.canvas.height);
    return result ? result.data : '';
  }

  private asyncScan(video: HTMLVideoElement): Promise<string> {
    const ctx = this.ctx;

    if (!ctx)
      return Promise.reject(ErrorMessage.InvalidCtx);

    return new Promise((resolve) => {
      this.intervalId = setInterval(() => {
        const result = this.getQRString(video, ctx);
        if (result) {
          this.stopCapture();
          resolve(result);
        }
      }, this.timout);
    });
  }

  private catchError(error: Error) {
    if (error.name == "NotAllowedError")
      console.log(ErrorMessage.NotAllowedError);
    else
      console.error(ErrorMessage.default, error);
  }

  // PUBLIC

  public async startCapture(video: HTMLElement, timout?: number) {
    if (!video || !(video instanceof HTMLVideoElement))
      return Promise.reject(ErrorMessage.InvalidVideo);

    this.timout = timout || this.timout;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.setVideoPlayback(video, this.mediaStream);
    } catch (error) {
      this.catchError(error);
      this.stopCapture();
    }

    return this.asyncScan(video);
  }

  public stopCapture(): void {
    if (this.intervalId)
      clearInterval(this.intervalId);

    if (this.mediaStream) {
      if (this.mediaStream.stop)
        this.mediaStream.stop();
      else this.mediaStream
        .getTracks()
        .forEach(track => {
          track.stop();
        });
    }
      
  }
}

export default QRReader;