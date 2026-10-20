{
const {test, assert, participantLink} = typeof require === 'function'
    ? {
        test: require('node:test'),
        assert: require('node:assert/strict'),
        participantLink: require('../shared/participant-link.js')
    }
    : window.seyItTestContext;

const COURSE_ID = 'microsoft-licensing-1118';
const PAGE_URL = 'https://example.com/Firmen%20Dashboard/firmen-dashboard.html?theme=light&name=Acme#top';

test('participant url keeps only the participant parameter', () => {
    const url = new URL(participantLink.buildParticipantUrl(PAGE_URL, COURSE_ID));
    assert.equal(url.pathname, '/Firmen%20Dashboard/firmen-dashboard.html');
    assert.equal(url.search, `?participant=${COURSE_ID}`);
    assert.equal(url.hash, '');
});

test('course id is read from the participant parameter', () => {
    assert.equal(participantLink.courseIdFromSearch(`?theme=dark&participant=${COURSE_ID}`), COURSE_ID);
});

test('course id is null without participant parameter', () => {
    assert.equal(participantLink.courseIdFromSearch('?course=abc'), null);
});

test('registering a participant stores a normalized private email', () => {
    const result = participantLink.registerParticipant([], COURSE_ID, {name: '  Max Muster ', email: ' Max@Gmail.COM '});
    assert.equal(result.ok, true);
    assert.deepEqual(result.registrations, [{courseId: COURSE_ID, name: 'Max Muster', email: 'max@gmail.com'}]);
});

test('registering rejects an empty name', () => {
    assert.deepEqual(participantLink.registerParticipant([], COURSE_ID, {name: ' ', email: 'a@b.de'}), {ok: false, error: 'invalidName'});
});

test('registering rejects an invalid email', () => {
    assert.deepEqual(participantLink.registerParticipant([], COURSE_ID, {name: 'Max', email: 'kein-email'}), {ok: false, error: 'invalidEmail'});
});

test('registering rejects a duplicate email for the same course', () => {
    const first = participantLink.registerParticipant([], COURSE_ID, {name: 'Max', email: 'max@gmail.com'});
    const second = participantLink.registerParticipant(first.registrations, COURSE_ID, {name: 'Max M.', email: 'MAX@gmail.com'});
    assert.deepEqual(second, {ok: false, error: 'duplicateEmail'});
});

test('the same email may register for a different course', () => {
    const first = participantLink.registerParticipant([], COURSE_ID, {name: 'Max', email: 'max@gmail.com'});
    const second = participantLink.registerParticipant(first.registrations, 'microsoft-licensing-1125', {name: 'Max', email: 'max@gmail.com'});
    assert.equal(second.ok, true);
});

test('registrations are filtered by course', () => {
    const entries = [
        {courseId: COURSE_ID, name: 'A', email: 'a@x.de'},
        {courseId: 'microsoft-licensing-1125', name: 'B', email: 'b@x.de'}
    ];
    assert.deepEqual(participantLink.registrationsForCourse(entries, COURSE_ID), [entries[0]]);
});
}
