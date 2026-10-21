{
const {test, assert, qr} = typeof require === 'function'
    ? {
        test: require('node:test'),
        assert: require('node:assert/strict'),
        qr: require('../shared/qr-code.js')
    }
    : window.seyItTestContext;

const QUIET_ZONE_MODULES = 4;

test('shortest payload yields a version 1 symbol plus quiet zone', () => {
    assert.equal(qr.buildQrPath('A').size, 21 + 2 * QUIET_ZONE_MODULES);
});

test('longer payload yields a larger symbol', () => {
    const url = 'https://example.com/Firmen%20Dashboard/firmen-dashboard.html?participant=microsoft-licensing-1118';
    assert.ok(qr.buildQrPath(url).size > qr.buildQrPath('A').size);
});

test('path consists of unit squares and is deterministic', () => {
    const first = qr.buildQrPath('https://sey-it.com/');
    assert.ok(/^(M\d+ \d+h1v1h-1z)+$/.test(first.path));
    assert.equal(qr.buildQrPath('https://sey-it.com/').path, first.path);
});

test('different payloads yield different paths', () => {
    assert.ok(qr.buildQrPath('one').path !== qr.buildQrPath('two').path);
});

test('high error correction yields a larger symbol for the same payload', () => {
    const url = 'https://example.com/Firmen%20Dashboard/firmen-dashboard.html?participant=microsoft-licensing-1118';
    assert.ok(qr.buildQrPath(url, {errorCorrectionLevel: 'H'}).size > qr.buildQrPath(url).size);
});

test('logo placement is centered in the symbol', () => {
    const size = 49;
    const {box, logo} = qr.buildLogoPlacement(size, 1804 / 786);
    assert.equal(box.x + box.width / 2, size / 2);
    assert.equal(box.y + box.height / 2, size / 2);
    assert.equal(logo.x + logo.width / 2, size / 2);
    assert.equal(logo.y + logo.height / 2, size / 2);
});

test('logo keeps its aspect ratio and fits inside the white box', () => {
    const {box, logo} = qr.buildLogoPlacement(49, 1804 / 786);
    assert.ok(Math.abs(logo.width / logo.height - 1804 / 786) < 1e-9);
    assert.ok(logo.x > box.x && logo.y > box.y);
    assert.ok(logo.x + logo.width < box.x + box.width);
    assert.ok(logo.y + logo.height < box.y + box.height);
});

test('logo box covers at most 10 percent of the symbol so level H stays readable', () => {
    const size = 49;
    const moduleCount = size - 2 * QUIET_ZONE_MODULES;
    const {box} = qr.buildLogoPlacement(size, 1804 / 786);
    assert.ok(box.width * box.height <= 0.1 * moduleCount * moduleCount);
});

test('logo is wide enough to stay clearly visible', () => {
    const size = 49;
    const moduleCount = size - 2 * QUIET_ZONE_MODULES;
    const {logo} = qr.buildLogoPlacement(size, 1804 / 786);
    assert.ok(logo.width >= 0.38 * moduleCount);
});

test('logo box stays clear of the finder patterns', () => {
    const size = 33;
    const finderSize = 8;
    const near = QUIET_ZONE_MODULES;
    const far = size - QUIET_ZONE_MODULES - finderSize;
    const finders = [[near, near], [far, near], [near, far]];
    const {box} = qr.buildLogoPlacement(size, 1804 / 786);
    finders.forEach(([x, y]) => {
        const overlaps = box.x < x + finderSize && box.x + box.width > x
            && box.y < y + finderSize && box.y + box.height > y;
        assert.equal(overlaps, false);
    });
});
}
