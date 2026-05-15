odoo.define('pos_barcode_camera_scan.CameraScanPopup', function (require) {
    'use strict';

    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { onMounted, onWillUnmount, useState, useRef } = owl;

    class CameraScanPopup extends AbstractAwaitablePopup {
        setup() {
            super.setup();

            this.state = useState({
                flashOn: false,
                flashSupported: false,
                manualMode: false,
                manualInput: '',
                scannedCode: null,
                error: null,
            });

            this.videoRef   = useRef('cameraVideo');
            this.codeReader = null;
            this.videoTrack = null;
            this._scanned   = false;

            onMounted(() => this._startCamera());
            onWillUnmount(() => this._stopCamera());
        }

        onOverlayClick(ev) {
            ev.stopPropagation();
            this.cancel();
        }

        onModalClick(ev) {
            ev.stopPropagation();
        }

        async _startCamera() {
            const videoEl = this.videoRef.el;
            if (!videoEl) return;

            try {
                const hints = new Map();
                hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
                    ZXing.BarcodeFormat.EAN_13,
                    ZXing.BarcodeFormat.EAN_8,
                    ZXing.BarcodeFormat.UPC_A,
                    ZXing.BarcodeFormat.UPC_E,
                    ZXing.BarcodeFormat.CODE_128,
                    ZXing.BarcodeFormat.CODE_39,
                    ZXing.BarcodeFormat.QR_CODE,
                ]);

                this.codeReader = new ZXing.BrowserMultiFormatReader(hints);
                await this.codeReader.decodeFromConstraints(
                    { video: { facingMode: 'environment' } },
                    videoEl,
                    (result, _err) => {
                        if (result && !this._scanned) {
                            this._onScanSuccess(result.getText());
                        }
                    }
                );

                const stream = videoEl.srcObject;
                if (stream) {
                    const tracks = stream.getVideoTracks();
                    if (tracks.length > 0) {
                        this.videoTrack = tracks[0];
                        const caps = this.videoTrack.getCapabilities
                            ? this.videoTrack.getCapabilities()
                            : {};
                        if (caps.torch) {
                            this.state.flashSupported = true;
                        }
                    }
                }
            } catch (e) {
                console.error('Camera start error:', e);
                this.state.error = e.message || String(e);
            }
        }

        _stopCamera() {
            if (this.codeReader) {
                try { this.codeReader.reset(); } catch (_) {}
                this.codeReader = null;
            }
            const videoEl = this.videoRef.el;
            if (videoEl && videoEl.srcObject) {
                videoEl.srcObject.getTracks().forEach((t) => t.stop());
                videoEl.srcObject = null;
            }
            this.videoTrack = null;
        }

        getPayload() {
            return this.state.scannedCode;
        }

        _onScanSuccess(code) {
            this._scanned = true;
            this.state.scannedCode = code;
            if (navigator.vibrate) navigator.vibrate(100);
            this.confirm();
        }

        async toggleFlash() {
            if (!this.videoTrack) return;
            this.state.flashOn = !this.state.flashOn;
            try {
                await this.videoTrack.applyConstraints({
                    advanced: [{ torch: this.state.flashOn }],
                });
            } catch (e) {
                console.warn('Flash not supported:', e);
                this.state.flashOn = false;
            }
        }

        toggleManualMode() {
            this.state.manualMode = !this.state.manualMode;
        }

        onManualInput(ev) {
            this.state.manualInput = ev.target.value;
        }

        onManualKeydown(ev) {
            if (ev.key === 'Enter') this.onManualSubmit();
        }

        onManualSubmit() {
            const code = this.state.manualInput.trim();
            if (code) this._onScanSuccess(code);
        }

        onClose() {
            this.cancel();
        }
    }

    CameraScanPopup.template = 'CameraScanPopup';

    Registries.Component.add(CameraScanPopup);

    return CameraScanPopup;
});
