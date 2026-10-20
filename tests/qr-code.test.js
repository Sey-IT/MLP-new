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
}
