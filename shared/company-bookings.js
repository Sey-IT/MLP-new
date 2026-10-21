(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.seyItBookings = api;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    const MAX_PARTICIPANTS = 20;
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function buildFullName(firstName, lastName) {
        const first = String(firstName || '').trim();
        const last = String(lastName || '').trim();
        return first && last ? `${first} ${last}` : '';
    }

    function addBooking(bookings, courseId) {
        if (bookings.some(booking => booking.courseId === courseId)) return bookings;
        return [...bookings, {courseId, participants: []}];
    }

    function removeBooking(bookings, courseId) {
        return bookings.filter(booking => booking.courseId !== courseId);
    }

    function remainingSeats(booking) {
        return MAX_PARTICIPANTS - booking.participants.length;
    }

    function addParticipant(bookings, courseId, participant) {
        const booking = bookings.find(entry => entry.courseId === courseId);
        const name = String(participant.name || '').trim();
        const email = String(participant.email || '').trim().toLowerCase();

        if (!booking) return {ok: false, error: 'unknownBooking'};
        if (!name) return {ok: false, error: 'invalidName'};
        if (!EMAIL_PATTERN.test(email)) return {ok: false, error: 'invalidEmail'};
        if (booking.participants.some(entry => entry.email === email)) return {ok: false, error: 'duplicateEmail'};
        if (remainingSeats(booking) <= 0) return {ok: false, error: 'bookingFull'};

        return {
            ok: true,
            bookings: bookings.map(entry => entry === booking
                ? {...entry, participants: [...entry.participants, {name, email}]}
                : entry)
        };
    }

    function removeParticipant(bookings, courseId, email) {
        const normalizedEmail = String(email).trim().toLowerCase();
        return bookings.map(booking => booking.courseId === courseId
            ? {...booking, participants: booking.participants.filter(entry => entry.email !== normalizedEmail)}
            : booking);
    }

    const COUNTRY_SECOND_LEVEL_LABELS = ['co', 'com', 'org', 'net', 'ac', 'gov'];
    const FREE_MAIL_PROVIDERS = [
        'gmail', 'googlemail', 'outlook', 'hotmail', 'live', 'msn', 'yahoo', 'icloud', 'me', 'aol',
        'gmx', 'web', 't-online', 'freenet', 'posteo', 'proton', 'protonmail', 'mail'
    ];

    function companyNameFromEmail(email) {
        const normalizedEmail = String(email || '').trim().toLowerCase();
        if (!EMAIL_PATTERN.test(normalizedEmail)) return '';

        const labels = normalizedEmail.split('@')[1].split('.');
        const hasSecondLevelLabel = labels.length > 2
            && COUNTRY_SECOND_LEVEL_LABELS.includes(labels[labels.length - 2]);
        const companyLabel = labels[labels.length - (hasSecondLevelLabel ? 3 : 2)];
        if (!companyLabel || FREE_MAIL_PROVIDERS.includes(companyLabel)) return '';

        return companyLabel
            .split('-')
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function companyNameFromBookings(bookings) {
        const firstParticipant = bookings.flatMap(booking => booking.participants)[0];
        return firstParticipant ? companyNameFromEmail(firstParticipant.email) : '';
    }

    return {
        MAX_PARTICIPANTS,
        buildFullName,
        addBooking,
        removeBooking,
        addParticipant,
        removeParticipant,
        remainingSeats,
        companyNameFromEmail,
        companyNameFromBookings
    };
});
