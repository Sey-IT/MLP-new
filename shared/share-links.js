(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.seyItShare = api;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    const SHARE_TEMPLATES = {
        de: (workshopName, date) => `Wir nehmen am ${workshopName} der sey-IT am ${date} teil.`,
        en: (workshopName, date) => `We are attending the ${workshopName} by sey-IT on ${date}.`
    };

    const CERTIFICATE_TEMPLATES = {
        de: (workshopName, date) => `Ich habe am ${date} erfolgreich am ${workshopName} der sey-IT teilgenommen und mein Zertifikat erhalten.`,
        en: (workshopName, date) => `I successfully completed the ${workshopName} by sey-IT on ${date} and received my certificate.`
    };

    function buildShareText(workshopName, date, language = 'de') {
        return (SHARE_TEMPLATES[language] || SHARE_TEMPLATES.de)(workshopName, date);
    }

    function buildCertificateShareText(workshopName, date, language = 'de') {
        return (CERTIFICATE_TEMPLATES[language] || CERTIFICATE_TEMPLATES.de)(workshopName, date);
    }

    function buildShareLinks(text, pageUrl) {
        const encodedUrl = encodeURIComponent(pageUrl);
        return {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(text)}`,
            // Instagram bietet keine Web-Share-URL; der Text wird stattdessen kopiert.
            instagram: 'https://www.instagram.com/'
        };
    }

    return {buildShareText, buildCertificateShareText, buildShareLinks};
});
