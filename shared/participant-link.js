(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.seyItParticipantLink = api;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    const PARTICIPANT_PARAM = 'participant';
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function buildParticipantUrl(pageUrl, courseId) {
        const url = new URL(pageUrl);
        url.search = '';
        url.hash = '';
        url.searchParams.set(PARTICIPANT_PARAM, courseId);
        return url.href;
    }

    function courseIdFromSearch(search) {
        return new URLSearchParams(search).get(PARTICIPANT_PARAM);
    }

    function registerParticipant(registrations, courseId, participant) {
        const name = String(participant.name || '').trim();
        const email = String(participant.email || '').trim().toLowerCase();

        if (!name) return {ok: false, error: 'invalidName'};
        if (!EMAIL_PATTERN.test(email)) return {ok: false, error: 'invalidEmail'};
        if (registrations.some(entry => entry.courseId === courseId && entry.email === email)) {
            return {ok: false, error: 'duplicateEmail'};
        }
        return {ok: true, registrations: [...registrations, {courseId, name, email}]};
    }

    function registrationsForCourse(registrations, courseId) {
        return registrations.filter(entry => entry.courseId === courseId);
    }

    return {buildParticipantUrl, courseIdFromSearch, registerParticipant, registrationsForCourse};
});
