{
const {test, assert, chatIntents} = typeof require === 'function'
    ? {
        test: require('node:test'),
        assert: require('node:assert/strict'),
        chatIntents: require('../shared/chat-intents.js')
    }
    : window.seyItTestContext;

const landing = chatIntents.LANDING_INTENTS;
const answer = question => chatIntents.findAnswerKey(question, landing, 'landingChatFallbackAnswer');

test('booking questions map to the booking answer', () => {
    assert.equal(answer('Wie buche ich ein Training?'), 'landingChatBookingAnswer');
    assert.equal(answer('How do I book a seminar?'), 'landingChatBookingAnswer');
});

test('team questions map to the company answer', () => {
    assert.equal(answer('Kann ich 20 Mitarbeiter anmelden?'), 'landingChatCompanyAnswer');
    assert.equal(answer('Do you offer company bookings?'), 'landingChatCompanyAnswer');
});

test('free check questions map to the free check answer', () => {
    assert.equal(answer('Was ist der kostenlose Check?'), 'landingChatFreeCheckAnswer');
    assert.equal(answer('Do you check my licenses?'), 'landingChatFreeCheckAnswer');
});

test('tenant report questions map to the tenant answer', () => {
    assert.equal(answer('Wie bekomme ich den Tenant-Report?'), 'landingChatTenantAnswer');
});

test('date and price questions map to the dates answer', () => {
    assert.equal(answer('Wann findet der Workshop statt?'), 'landingChatDatesAnswer');
    assert.equal(answer('Was kostet das?'), 'landingChatDatesAnswer');
});

test('certificate questions use the fallback because there are no certificates', () => {
    assert.equal(answer('Wo finde ich mein Zertifikat?'), 'landingChatFallbackAnswer');
});

test('unknown questions use the fallback', () => {
    assert.equal(answer('Wie wird das Wetter?'), 'landingChatFallbackAnswer');
    assert.equal(answer('   '), 'landingChatFallbackAnswer');
});

test('matching ignores case', () => {
    assert.equal(answer('KOSTENLOSER CHECK'), 'landingChatFreeCheckAnswer');
});
}
