(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./vendor/qrcode.js'));
    } else {
        root.seyItQr = factory(root.qrcode);
    }
})(typeof self !== 'undefined' ? self : this, function (qrcode) {
    const QUIET_ZONE_MODULES = 4;
    const DEFAULT_ERROR_CORRECTION_LEVEL = 'M';
    const AUTO_TYPE_NUMBER = 0;
    const LOGO_WIDTH_RATIO = 0.38;
    const LOGO_PADDING_MODULES = 1;

    // Liefert die Modulgröße samt Ruhezone und einen SVG-Pfad aus Einheitsquadraten.
    function buildQrPath(text, {errorCorrectionLevel = DEFAULT_ERROR_CORRECTION_LEVEL} = {}) {
        const symbol = qrcode(AUTO_TYPE_NUMBER, errorCorrectionLevel);
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

    // Liefert die mittige weiße Fläche und die Logoposition in Moduleinheiten.
    function buildLogoPlacement(size, logoAspectRatio) {
        const moduleCount = size - 2 * QUIET_ZONE_MODULES;
        const logoWidth = moduleCount * LOGO_WIDTH_RATIO;
        const logoHeight = logoWidth / logoAspectRatio;
        const boxWidth = logoWidth + 2 * LOGO_PADDING_MODULES;
        const boxHeight = logoHeight + 2 * LOGO_PADDING_MODULES;
        const center = size / 2;
        return {
            box: {x: center - boxWidth / 2, y: center - boxHeight / 2, width: boxWidth, height: boxHeight},
            logo: {x: center - logoWidth / 2, y: center - logoHeight / 2, width: logoWidth, height: logoHeight}
        };
    }

    return {buildQrPath, buildLogoPlacement};
});
