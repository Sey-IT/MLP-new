(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.seyItParticipantLink = api;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    const PARTICIPANT_PARAM = 'participant';
    const CHECK_VALUES_PARAM = 'k';
    const CHECK_VALUE_LENGTH = 8;
    const CHECK_VALUES_PATTERN = /^(?:[0-9a-f]{8})+$/;
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const FNV_OFFSET_BASIS = 0x811c9dc5;
    const FNV_PRIME = 0x01000193;

    const normalizeEmail = email => String(email || '').trim().toLowerCase();
    const cleanName = name => String(name || '').normalize('NFC').trim().replace(/\s+/g, ' ');

    // FNV-1a (32 Bit): kurzer Prüfwert, damit der Link keine Namen im Klartext enthält.
    function nameCheckValue(courseId, name) {
        const input = `${courseId}|${cleanName(name).toLowerCase()}`;
        let hash = FNV_OFFSET_BASIS;
        for (const byte of new TextEncoder().encode(input)) {
            hash ^= byte;
            hash = Math.imul(hash, FNV_PRIME) >>> 0;
        }
        return hash.toString(16).padStart(CHECK_VALUE_LENGTH, '0');
    }

    function buildParticipantUrl(pageUrl, courseId, names = []) {
        const url = new URL(pageUrl);
        url.search = '';
        url.hash = '';
        url.searchParams.set(PARTICIPANT_PARAM, courseId);
        const checkValues = [...new Set(names.map(name => nameCheckValue(courseId, name)))].sort();
        if (checkValues.length > 0) url.searchParams.set(CHECK_VALUES_PARAM, checkValues.join(''));
        return url.href;
    }

    function courseIdFromSearch(search) {
        return new URLSearchParams(search).get(PARTICIPANT_PARAM);
    }

    function checkValuesFromSearch(search) {
        const joined = new URLSearchParams(search).get(CHECK_VALUES_PARAM) || '';
        if (!CHECK_VALUES_PATTERN.test(joined)) return [];
        return joined.match(new RegExp(`.{${CHECK_VALUE_LENGTH}}`, 'g'));
    }

    function verifyParticipant(checkValues, courseId, participant) {
        const name = cleanName(participant.name);
        const email = normalizeEmail(participant.email);

        if (!name) return {ok: false, error: 'invalidName'};
        if (!EMAIL_PATTERN.test(email)) return {ok: false, error: 'invalidEmail'};
        if (!checkValues.includes(nameCheckValue(courseId, name))) return {ok: false, error: 'notRegistered'};
        return {ok: true, participant: {name, email}};
    }

    return {buildParticipantUrl, courseIdFromSearch, nameCheckValue, checkValuesFromSearch, verifyParticipant};
});
