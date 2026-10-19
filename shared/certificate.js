(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.seyItCertificate = api;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    const PAGE_WIDTH_PT = 842;
    const PAGE_HEIGHT_PT = 595;
    const GERMAN_TRANSLITERATIONS = {ä: 'ae', ö: 'oe', ü: 'ue', Ä: 'Ae', Ö: 'Oe', Ü: 'Ue', ß: 'ss'};

    function isCertificateAvailable(workshopStart, now) {
        return now.getTime() >= workshopStart.getTime();
    }

    function buildFileName(participantName, isoDate) {
        const safeName = participantName
            .replace(/[äöüÄÖÜß]/g, character => GERMAN_TRANSLITERATIONS[character])
            .replace(/[^A-Za-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `Teilnahmezertifikat-${safeName}-${isoDate}.pdf`;
    }

    function encodeAscii(text) {
        return Uint8Array.from(text, character => character.charCodeAt(0));
    }

    function concatenate(parts) {
        const result = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
        let position = 0;
        parts.forEach(part => {
            result.set(part, position);
            position += part.length;
        });
        return result;
    }

    // Baut ein einseitiges A4-Querformat-PDF, dessen Seite vollständig vom JPEG ausgefüllt wird.
    function buildPdfFromJpeg(jpegBytes, imageWidth, imageHeight) {
        const pageContent = `q ${PAGE_WIDTH_PT} 0 0 ${PAGE_HEIGHT_PT} 0 0 cm /Certificate Do Q`;
        const objectBodies = [
            [encodeAscii('<< /Type /Catalog /Pages 2 0 R >>')],
            [encodeAscii('<< /Type /Pages /Kids [3 0 R] /Count 1 >>')],
            [encodeAscii(
                `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH_PT} ${PAGE_HEIGHT_PT}] `
                + '/Resources << /XObject << /Certificate 4 0 R >> >> /Contents 5 0 R >>'
            )],
            [
                encodeAscii(
                    `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} `
                    + `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
                ),
                jpegBytes,
                encodeAscii('\nendstream')
            ],
            [encodeAscii(`<< /Length ${pageContent.length} >>\nstream\n${pageContent}\nendstream`)]
        ];

        const parts = [encodeAscii('%PDF-1.4\n')];
        const offsets = [];
        let position = parts[0].length;
        objectBodies.forEach((body, index) => {
            offsets.push(position);
            const objectBytes = concatenate([encodeAscii(`${index + 1} 0 obj\n`), ...body, encodeAscii('\nendobj\n')]);
            parts.push(objectBytes);
            position += objectBytes.length;
        });

        const crossReference = ['xref', `0 ${objectBodies.length + 1}`, '0000000000 65535 f ']
            .concat(offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n `))
            .join('\n');
        const trailer = `\ntrailer\n<< /Size ${objectBodies.length + 1} /Root 1 0 R >>\nstartxref\n${position}\n%%EOF\n`;
        parts.push(encodeAscii(crossReference + trailer));
        return concatenate(parts);
    }

    return {isCertificateAvailable, buildFileName, buildPdfFromJpeg};
});
