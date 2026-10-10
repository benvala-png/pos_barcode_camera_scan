# pos_barcode_camera_scan (Odoo 16)

> **In English —** Scan barcodes with a phone or tablet camera directly in the Odoo 16 POS, as a complement to a hardware scanner. Scanned codes go through the same pipeline as a physical scanner; manual entry is the fallback when the camera is unavailable (HTTPS is required for camera access).

*Documentation below is in French.*

Addon Odoo 16 Community qui ajoute le scan de code-barres **par la caméra**
dans l'interface POS — pensé en complément d'un scanner physique, pour un
usage mobile/tablette.

**HTTPS obligatoire** pour l'accès caméra (les navigateurs bloquent
`getUserMedia` en HTTP simple). En HTTP, le module retombe sur la saisie
manuelle seule.

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| Bouton de scan | Icône caméra ajoutée aux boutons de contrôle de l'écran de vente (`ProductScreen`) |
| Popup plein écran | Flux vidéo de la caméra arrière en direct |
| Flash / torche | Activable quand l'appareil le permet |
| Saisie manuelle | Repli si la caméra est refusée ou indisponible (HTTP, permission refusée) |
| Intégration native | Le code lu déclenche `this.env.barcode_reader.scan(payload)` — le même pipeline qu'un scanner physique |

---

## Installation

1. Copier le dossier `pos_barcode_camera_scan` dans un répertoire présent dans `addons_path` (dépend de `point_of_sale`, inclus dans Odoo)
2. Redémarrer Odoo, aucune session POS ouverte
3. **Apps > Mettre à jour la liste des applications**
4. Rechercher `POS Barcode Camera Scan` et cliquer sur **Installer**
5. Vérifier que le site est servi en **HTTPS** — sinon le bouton retombe sur la saisie manuelle

---

## Logique

Le décodage se fait avec la bibliothèque `html5-qrcode` (v2.x, incluse dans
`static/src/lib/`). Le module a démarré avec ZXing-js puis migré vers
html5-qrcode ; le fichier `zxing.min.js` historique a été retiré (mort,
jamais chargé par le manifeste).

Le bouton s'ajoute via `ProductScreen.addControlButton` avec
`condition: () => true` — il est donc toujours visible, indépendamment du
matériel réellement branché.

---

## Limites connues

- La qualité du décodage dépend de la luminosité et de la caméra de l'appareil.
- Pour un usage caissier à volume élevé, un scanner physique Bluetooth ou USB reste recommandé — ce module est un complément, pas un remplacement.

---

## Structure du module

```
pos_barcode_camera_scan/
├── __init__.py
├── __manifest__.py
└── static/src/
    ├── js/
    │   ├── CameraScanButton.js   # Bouton de contrôle sur ProductScreen
    │   └── CameraScanPopup.js    # Popup plein écran, flux caméra + torche
    ├── lib/
    │   └── html5-qrcode.min.js   # Bibliothèque de décodage (Apache 2.0)
    ├── scss/
    │   └── camera_scan.scss
    └── xml/
        └── camera_scan.xml       # Templates QWeb du bouton et de la popup
```

---

## Crédits

- [html5-qrcode](https://github.com/mebjas/html5-qrcode) — décodage code-barres/QR (Apache 2.0)
- [Odoo](https://github.com/odoo/odoo) — framework de base (LGPL-3)

## Licence

LGPL-3, cohérent avec l'écosystème Odoo.
