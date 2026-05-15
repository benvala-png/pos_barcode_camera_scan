{
    'name': 'POS Barcode Camera Scan',
    'version': '16.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Scanner les codes-barres avec la caméra du téléphone dans le POS',
    'author': 'Benjamin',
    'license': 'LGPL-3',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale.assets': [
            'pos_barcode_camera_scan/static/src/lib/zxing.min.js',
            'pos_barcode_camera_scan/static/src/js/CameraScanPopup.js',
            'pos_barcode_camera_scan/static/src/js/CameraScanButton.js',
            'pos_barcode_camera_scan/static/src/xml/camera_scan.xml',
            'pos_barcode_camera_scan/static/src/scss/camera_scan.scss',
        ],
    },
    'installable': True,
    'application': False,
}
