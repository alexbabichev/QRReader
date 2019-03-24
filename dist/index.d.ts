declare class QRReader {
    private timout;
    private intervalId;
    private canvas;
    private ctx;
    private constraints;
    private mediaStream;
    private iOS;
    isMediaStreamAPISupported: boolean;
    constructor();
    private setCanvasProperties;
    private setConstraints;
    private setVideoPlayback;
    private getVideoInputDevice;
    private getFrame;
    private getQRString;
    private asyncScan;
    private catchError;
    startCapture(video: HTMLElement, timout?: number): Promise<string>;
    stopCapture(): void;
}
export default QRReader;
