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

test('the check value is an 8 digit hex string independent of case and spacing', () => {
    const value = participantLink.nameCheckValue(COURSE_ID, '  anna   BEISPIEL ');
    assert.ok(/^[0-9a-f]{8}$/.test(value));
    assert.equal(participantLink.nameCheckValue(COURSE_ID, 'Anna Beispiel'), value);
});

test('the check value differs per course and per name', () => {
    const value = participantLink.nameCheckValue(COURSE_ID, 'Anna Beispiel');
    assert.ok(participantLink.nameCheckValue('microsoft-licensing-1125', 'Anna Beispiel') !== value);
    assert.ok(participantLink.nameCheckValue(COURSE_ID, 'Ben Beispiel') !== value);
});

test('participant url carries check values but never the plain name', () => {
    const href = participantLink.buildParticipantUrl(PAGE_URL, COURSE_ID, ['Anna Beispiel', 'Ben Muster']);
    assert.ok(!href.toLowerCase().includes('anna'));
    assert.ok(!href.toLowerCase().includes('muster'));
    assert.equal(participantLink.checkValuesFromSearch(new URL(href).search).length, 2);
});

test('check values round trip through the url', () => {
    const href = participantLink.buildParticipantUrl(PAGE_URL, COURSE_ID, ['Anna Beispiel']);
    assert.deepEqual(
        participantLink.checkValuesFromSearch(new URL(href).search),
        [participantLink.nameCheckValue(COURSE_ID, 'Anna Beispiel')]
    );
});

test('duplicate names produce a single check value', () => {
    const href = participantLink.buildParticipantUrl(PAGE_URL, COURSE_ID, ['Anna Beispiel', 'ANNA beispiel']);
    assert.equal(participantLink.checkValuesFromSearch(new URL(href).search).length, 1);
});

test('missing or malformed check values yield an empty list', () => {
    assert.deepEqual(participantLink.checkValuesFromSearch(`?participant=${COURSE_ID}`), []);
    assert.deepEqual(participantLink.checkValuesFromSearch(`?participant=${COURSE_ID}&k=xyz`), []);
});

const checkValues = [participantLink.nameCheckValue(COURSE_ID, 'Anna Beispiel')];

test('a registered participant is verified by name with normalized input', () => {
    const result = participantLink.verifyParticipant(checkValues, COURSE_ID, {name: '  anna  beispiel ', email: ' ANNA@firma.de '});
    assert.deepEqual(result, {ok: true, participant: {name: 'anna beispiel', email: 'anna@firma.de'}});
});

test('a registered name is accepted with any valid email address', () => {
    const result = participantLink.verifyParticipant(checkValues, COURSE_ID, {name: 'Anna Beispiel', email: 'anna.beispiel@andere-firma.de'});
    assert.equal(result.ok, true);
});

test('an unregistered name is rejected', () => {
    const result = participantLink.verifyParticipant(checkValues, COURSE_ID, {name: 'Ben Beispiel', email: 'anna@firma.de'});
    assert.deepEqual(result, {ok: false, error: 'notRegistered'});
});

test('a registered name of a different course is rejected', () => {
    const result = participantLink.verifyParticipant(checkValues, 'microsoft-licensing-1125', {name: 'Anna Beispiel', email: 'anna@firma.de'});
    assert.deepEqual(result, {ok: false, error: 'notRegistered'});
});

test('verification rejects an empty name', () => {
    assert.deepEqual(participantLink.verifyParticipant(checkValues, COURSE_ID, {name: ' ', email: 'anna@firma.de'}), {ok: false, error: 'invalidName'});
});

test('verification rejects an invalid email', () => {
    assert.deepEqual(participantLink.verifyParticipant(checkValues, COURSE_ID, {name: 'Anna Beispiel', email: 'kein-email'}), {ok: false, error: 'invalidEmail'});
});
}
