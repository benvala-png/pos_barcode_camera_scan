# POS Barcode Camera Scan

Odoo 16 Community module adding camera-based barcode scanning to the Point of Sale interface — designed as a complement to physical scanners for mobile/tablet usage.

## Prerequisites

- Odoo 16 Community
- **HTTPS required** for camera access (browsers block `getUserMedia` on plain HTTP). On HTTP, the module falls back to manual entry only.

## Features

- **Scan button** in the POS ProductScreen (camera icon)
- **Full-screen popup** with live rear-camera stream
- **Flash/torch** support when available on the device
- **Manual entry fallback** when HTTP is used or camera access is denied
- **Native Odoo barcode_reader integration** — triggers the same pipeline as a physical scanner

## Installation

1. Clone this repository into your Odoo `extra-addons` folder:
   ```bash
   git clone https://github.com/benvala-png/pos_barcode_camera_scan.git /path/to/extra-addons/pos_barcode_camera_scan
   ```
2. Restart Odoo and update the apps list (`Settings > Apps > Update Apps List`).
3. Search for **"POS Barcode Camera Scan"** and install it.
4. Open your Point of Sale configuration and verify the module is active.

## Known Limitations

- Decoding performance varies depending on lighting conditions and camera quality.
- For high-volume cashier use, a physical Bluetooth or USB barcode scanner is recommended.

## Credits

- [ZXing-js](https://github.com/zxing-js/library) — barcode decoding library (Apache 2.0)
- [Odoo](https://github.com/odoo/odoo) — base framework (LGPL-3)

## License

This module is released under the [GNU Lesser General Public License v3](LICENSE), consistent with the Odoo ecosystem.
