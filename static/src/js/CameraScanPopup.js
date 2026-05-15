odoo.define('pos_barcode_camera_scan.CameraScanPopup', function (require) {
    'use strict';

    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    const { onMounted, onWillUnmount, useState } = owl;

    const READER_DIV_ID = 'pos-camera-scan-reader';

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

            this.html5QrCode = null;
            this.videoTrack  = null;
            this._scanned    = false;

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
            try {
                this.html5QrCode = new Html5Qrcode(READER_DIV_ID, { verbose: false });

                await this.html5QrCode.start(
                    { facingMode: 'environment' },
                    { fps: 10, aspectRatio: 1.0 },
                    (decodedText) => {
                        if (!this._scanned) this._onScanSuccess(decodedText);
                    },
                    // per-frame errors are normal (no barcode in frame) — suppress
                    () => {}
                );

                // Grab video track for torch control
                const videoEl = document.getElementById(READER_DIV_ID)
                    ?.querySelector('video');
                if (videoEl && videoEl.srcObject) {
                    const tracks = videoEl.srcObject.getVideoTracks();
                    if (tracks.length > 0) {
                        this.videoTrack = tracks[0];
                        const caps = this.videoTrack.getCapabilities
                            ? this.videoTrack.getCapabilities()
                            : {};
                        if (caps.torch) this.state.flashSupported = true;
                    }
                }
            } catch (e) {
                console.error('Camera start error:', e);
                this.state.error = e.message || String(e);
            }
        }

        async _stopCamera() {
            if (this.html5QrCode) {
                try {
                    const state = this.html5QrCode.getState();
                    // state 2 = SCANNING, state 3 = PAUSED
                    if (state === 2 || state === 3) {
                        await this.html5QrCode.stop();
                    }
                } catch (_) {}
                try { this.html5QrCode.clear(); } catch (_) {}
                this.html5QrCode = null;
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
