odoo.define('pos_barcode_camera_scan.CameraScanButton', function (require) {
    'use strict';

    const PosComponent  = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries    = require('point_of_sale.Registries');

    class CameraScanButton extends PosComponent {
        async onClick() {
            console.log('[CameraBtn] onClick fired, opening showPopup');
            const { confirmed, payload } = await this.showPopup('CameraScanPopup', {});
            if (confirmed && payload) {
                console.log('[CameraBtn] scan confirmed, code:', payload);
                await this.env.barcode_reader.scan(payload);
            }
        }
    }

    CameraScanButton.template = 'CameraScanButton';

    ProductScreen.addControlButton({
        component: CameraScanButton,
        condition: function () { return true; },
    });

    Registries.Component.add(CameraScanButton);

    return CameraScanButton;
});
