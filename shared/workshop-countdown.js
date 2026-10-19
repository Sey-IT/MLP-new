(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.seyItCountdown = api;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    const SECOND_MS = 1000;
    const MINUTE_MS = 60 * SECOND_MS;
    const HOUR_MS = 60 * MINUTE_MS;
    const DAY_MS = 24 * HOUR_MS;

    function splitRemainingTime(start, now) {
        const remainingMs = Math.max(0, start.getTime() - now.getTime());
        return {
            days: Math.floor(remainingMs / DAY_MS),
            hours: Math.floor((remainingMs % DAY_MS) / HOUR_MS),
            minutes: Math.floor((remainingMs % HOUR_MS) / MINUTE_MS),
            seconds: Math.floor((remainingMs % MINUTE_MS) / SECOND_MS)
        };
    }

    function findNextStart(starts, now) {
        const upcoming = starts
            .filter(start => start.getTime() > now.getTime())
            .sort((first, second) => first.getTime() - second.getTime());
        return upcoming.length > 0 ? upcoming[0] : null;
    }

    function startOfDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function daysUntil(start, now) {
        const calendarDays = Math.round((startOfDay(start) - startOfDay(now)) / DAY_MS);
        return Math.max(0, calendarDays);
    }

    return {splitRemainingTime, findNextStart, daysUntil};
});
