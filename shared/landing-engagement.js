(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.seyItEngagement = api;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const MIN_RATING = 1;
    const MAX_RATING = 5;

    function validateFreeCheck({email, licenseDetails, softwareDetails}) {
        const errors = {};
        if (!EMAIL_PATTERN.test(String(email || '').trim())) errors.email = 'invalidEmail';
        if (!String(licenseDetails || '').trim()) errors.licenseDetails = 'required';
        if (!String(softwareDetails || '').trim()) errors.softwareDetails = 'required';
        return {ok: Object.keys(errors).length === 0, errors};
    }

    function isValidRating(value) {
        return Number.isInteger(value) && value >= MIN_RATING && value <= MAX_RATING;
    }

    function summarizeRatings(ratings) {
        const validRatings = ratings.filter(isValidRating);
        if (validRatings.length === 0) return {count: 0, average: 0};
        const sum = validRatings.reduce((total, value) => total + value, 0);
        return {count: validRatings.length, average: Math.round((sum / validRatings.length) * 10) / 10};
    }

    return {MIN_RATING, MAX_RATING, validateFreeCheck, isValidRating, summarizeRatings};
});
