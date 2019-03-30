declare class QRReader {
    private captureInterval;
    private intervalId;
    private canvas;
    private ctx;
    private constraints;
    private mediaStream;
    private facingMode;
    constructor();
    private isMobileDevice;
    private setCanvasProperties;
    private setConstraints;
    private setVideoPlayback;
    private getFrame;
    private getQRString;
    private asyncScan;
    private catchError;
    startCapture(video: HTMLElement, captureInterval?: number): Promise<string>;
    stopAndSwitchCamera(): void;
    stopCapture(): void;
    getVideoInputDevices(): Promise<MediaDeviceInfo[]>;
    isMediaStreamAPISupported(): boolean;
}
export default QRReader;
