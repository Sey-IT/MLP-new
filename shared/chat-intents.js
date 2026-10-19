(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.seyItChatIntents = api;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    // Reihenfolge entspricht der Priorität: spezifische Themen vor allgemeinen.
    const LANDING_INTENTS = [
        {answerKey: 'landingChatTenantAnswer', pattern: /tenant|report|csv|excel|xlsx/},
        {answerKey: 'landingChatFreeCheckAnswer', pattern: /kostenlos|gratis|free|check|lizenz|licen[cs]e|software/},
        {answerKey: 'landingChatCompanyAnswer', pattern: /firma|unternehmen|team|mitarbeiter|teilnehmer|company|employee|participant/},
        {answerKey: 'landingChatDatesAnswer', pattern: /wann|termin|datum|preis|kost|when|date|price|cost/},
        {answerKey: 'landingChatBookingAnswer', pattern: /buch|anmeld|training|seminar|workshop|book|register|course/}
    ];

    function findAnswerKey(question, intents, fallbackKey) {
        const normalizedQuestion = String(question || '').trim().toLocaleLowerCase();
        if (!normalizedQuestion) return fallbackKey;
        const match = intents.find(intent => intent.pattern.test(normalizedQuestion));
        return match ? match.answerKey : fallbackKey;
    }

    return {LANDING_INTENTS, findAnswerKey};
});
