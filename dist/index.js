"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsqr_1 = require("jsqr");
var ErrorMessage;
(function (ErrorMessage) {
    ErrorMessage["InvalidVideo"] = "Invalid video element";
    ErrorMessage["InvalidCtx"] = "Internal error. No ctx created";
    ErrorMessage["NotAllowedError"] = "User has denied access to camera";
    ErrorMessage["default"] = "QRReader error occurred";
})(ErrorMessage || (ErrorMessage = {}));
;
class QRReader {
    constructor() {
        this.timout = 500;
        this.intervalId = null;
        this.constraints = { audio: false, video: true };
        this.mediaStream = null;
        this.iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
        this.isMediaStreamAPISupported = navigator && navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices;
        this.setConstraints();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setCanvasProperties(this.canvas);
    }
    setCanvasProperties(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setConstraints() {
        this.getVideoInputDevice().
            then(device => {
            if (device)
                this.constraints.video = {
                    deviceId: device.deviceId,
                    facingMode: this.iOS ? 'environment' : undefined
                };
        });
    }
    setVideoPlayback(video, stream) {
        video.setAttribute('playsinline', 'true');
        video.srcObject = stream;
        video.play();
    }
    getVideoInputDevice() {
        return navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
            const videoInputDevices = devices
                .filter((device) => {
                return device.kind === 'videoinput';
            });
            return videoInputDevices[videoInputDevices.length - 1];
        });
    }
    getFrame(video, ctx) {
        ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
        return ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    }
    getQRString(video, ctx) {
        const result = jsqr_1.default(this.getFrame(video, ctx), this.canvas.width, this.canvas.height);
        return result ? result.data : '';
    }
    asyncScan(video) {
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
    catchError(error) {
        if (error.name == "NotAllowedError")
            console.log(ErrorMessage.NotAllowedError);
        else
            console.error(ErrorMessage.default, error);
    }
    // PUBLIC
    startCapture(video, timout) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!video || !(video instanceof HTMLVideoElement))
                return Promise.reject(ErrorMessage.InvalidVideo);
            this.timout = timout || this.timout;
            try {
                this.mediaStream = yield navigator.mediaDevices.getUserMedia(this.constraints);
                this.setVideoPlayback(video, this.mediaStream);
            }
            catch (error) {
                this.catchError(error);
                this.stopCapture();
            }
            return this.asyncScan(video);
        });
    }
    stopCapture() {
        if (this.intervalId)
            clearInterval(this.intervalId);
        if (this.mediaStream) {
            if (this.mediaStream.stop)
                this.mediaStream.stop();
            else
                this.mediaStream
                    .getTracks()
                    .forEach(track => {
                    track.stop();
                });
        }
    }
}
exports.default = QRReader;
