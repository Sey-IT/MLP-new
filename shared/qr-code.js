(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./vendor/qrcode.js'));
    } else {
        root.seyItQr = factory(root.qrcode);
    }
})(typeof self !== 'undefined' ? self : this, function (qrcode) {
    const QUIET_ZONE_MODULES = 4;
    const ERROR_CORRECTION_LEVEL = 'M';
    const AUTO_TYPE_NUMBER = 0;

    // Liefert die Modulgröße samt Ruhezone und einen SVG-Pfad aus Einheitsquadraten.
    function buildQrPath(text) {
        const symbol = qrcode(AUTO_TYPE_NUMBER, ERROR_CORRECTION_LEVEL);
        symbol.addData(text);
        symbol.make();

        const moduleCount = symbol.getModuleCount();
        const squares = [];
        for (let row = 0; row < moduleCount; row++) {
            for (let column = 0; column < moduleCount; column++) {
                if (symbol.isDark(row, column)) {
                    squares.push(`M${column + QUIET_ZONE_MODULES} ${row + QUIET_ZONE_MODULES}h1v1h-1z`);
                }
            }
        }
        return {size: moduleCount + 2 * QUIET_ZONE_MODULES, path: squares.join('')};
    }

    return {buildQrPath};
});
