declare class QRReader {
    private timout;
    private intervalId;
    private canvas;
    private ctx;
    private constraints;
    private mediaStream;
    private videoInputDevices;
    private facingMode;
    isMediaStreamAPISupported: boolean;
    constructor();
    private isMobileDevice;
    private setCanvasProperties;
    private setConstraints;
    private setVideoPlayback;
    private getVideoInputDevice;
    private getFrame;
    private getQRString;
    private asyncScan;
    private catchError;
    startCapture(video: HTMLElement, timout?: number): Promise<string>;
    stopAndSwitchCamera(): void;
    stopCapture(): void;
}
export default QRReader;
