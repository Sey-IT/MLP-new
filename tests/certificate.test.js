{
const {test, assert, certificate} = typeof require === 'function'
    ? {
        test: require('node:test'),
        assert: require('node:assert/strict'),
        certificate: require('../shared/certificate.js')
    }
    : window.seyItTestContext;

const at = value => new Date(value);
const decode = bytes => Array.from(bytes, byte => String.fromCharCode(byte)).join('');
const sampleJpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 0xff, 0xd9]);

test('the certificate is unavailable before the workshop starts', () => {
    assert.equal(certificate.isCertificateAvailable(at('2026-11-18T09:00:00'), at('2026-11-18T08:59:59')), false);
});

test('the certificate is available once the workshop has started', () => {
    assert.equal(certificate.isCertificateAvailable(at('2026-11-18T09:00:00'), at('2026-11-18T09:00:00')), true);
    assert.equal(certificate.isCertificateAvailable(at('2026-11-18T09:00:00'), at('2026-12-01T10:00:00')), true);
});

test('the file name is derived from the participant name', () => {
    assert.equal(certificate.buildFileName('Anna Müller', '2026-11-18'), 'Teilnahmezertifikat-Anna-Mueller-2026-11-18.pdf');
});

test('unsafe characters are removed from the file name', () => {
    assert.equal(certificate.buildFileName('  Max / Mustermann: <1> ', '2026-11-25'), 'Teilnahmezertifikat-Max-Mustermann-1-2026-11-25.pdf');
});

test('the pdf has a header, the embedded image and a trailer', () => {
    const text = decode(certificate.buildPdfFromJpeg(sampleJpeg, 1754, 1240));
    assert.ok(text.startsWith('%PDF-1.4'));
    assert.ok(text.includes('/Subtype /Image'));
    assert.ok(text.includes('/Width 1754'));
    assert.ok(text.includes('/Height 1240'));
    assert.ok(text.trimEnd().endsWith('%%EOF'));
});

test('the pdf embeds the jpeg bytes unchanged', () => {
    const pdf = certificate.buildPdfFromJpeg(sampleJpeg, 10, 10);
    const marker = decode(sampleJpeg);
    assert.ok(decode(pdf).includes(marker));
});

test('the cross reference offsets point at the objects', () => {
    const text = decode(certificate.buildPdfFromJpeg(sampleJpeg, 100, 50));
    const startxref = Number(/startxref\s+(\d+)/.exec(text)[1]);
    assert.ok(text.slice(startxref).startsWith('xref'));
    const offsets = [...text.slice(startxref).matchAll(/(\d{10}) 00000 n/g)].map(match => Number(match[1]));
    assert.equal(offsets.length, 5);
    offsets.forEach((offset, index) => {
        assert.ok(text.slice(offset).startsWith(`${index + 1} 0 obj`));
    });
});

test('the page is a4 landscape', () => {
    const text = decode(certificate.buildPdfFromJpeg(sampleJpeg, 100, 50));
    assert.ok(text.includes('/MediaBox [0 0 842 595]'));
});
}
