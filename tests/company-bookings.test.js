const {test, assert, bookings} = typeof require === 'function'
    ? {
        test: require('node:test'),
        assert: require('node:assert/strict'),
        bookings: require('../shared/company-bookings.js')
    }
    : window.seyItTestContext;

const anna = {name: 'Anna Beispiel', email: 'anna@firma.de'};

test('maximum is 20 participants per booking', () => {
    assert.equal(bookings.MAX_PARTICIPANTS, 20);
});

test('adding a course creates an empty booking', () => {
    const result = bookings.addBooking([], 'microsoft-licensing');
    assert.deepEqual(result, [{courseId: 'microsoft-licensing', participants: []}]);
});

test('adding the same course twice keeps a single booking', () => {
    const once = bookings.addBooking([], 'microsoft-licensing');
    assert.equal(bookings.addBooking(once, 'microsoft-licensing').length, 1);
});

test('removing a booking drops it from the list', () => {
    const list = bookings.addBooking([], 'microsoft-licensing');
    assert.deepEqual(bookings.removeBooking(list, 'microsoft-licensing'), []);
});

test('a valid participant is added without mutating the input', () => {
    const list = bookings.addBooking([], 'microsoft-licensing');
    const result = bookings.addParticipant(list, 'microsoft-licensing', anna);
    assert.equal(result.ok, true);
    assert.equal(result.bookings[0].participants.length, 1);
    assert.equal(list[0].participants.length, 0);
});

test('participant name and email are trimmed', () => {
    const list = bookings.addBooking([], 'c1');
    const result = bookings.addParticipant(list, 'c1', {name: '  Anna  ', email: ' ANNA@firma.de '});
    assert.deepEqual(result.bookings[0].participants[0], {name: 'Anna', email: 'anna@firma.de'});
});

test('an empty name is rejected', () => {
    const list = bookings.addBooking([], 'c1');
    const result = bookings.addParticipant(list, 'c1', {name: ' ', email: 'a@b.de'});
    assert.deepEqual([result.ok, result.error], [false, 'invalidName']);
});

test('an invalid email is rejected', () => {
    const list = bookings.addBooking([], 'c1');
    const result = bookings.addParticipant(list, 'c1', {name: 'Anna', email: 'kein-email'});
    assert.deepEqual([result.ok, result.error], [false, 'invalidEmail']);
});

test('a duplicate email within a booking is rejected', () => {
    const list = bookings.addBooking([], 'c1');
    const first = bookings.addParticipant(list, 'c1', anna);
    const second = bookings.addParticipant(first.bookings, 'c1', {name: 'Anna 2', email: 'ANNA@firma.de'});
    assert.deepEqual([second.ok, second.error], [false, 'duplicateEmail']);
});

test('the same person may join different bookings', () => {
    let list = bookings.addBooking(bookings.addBooking([], 'c1'), 'c2');
    list = bookings.addParticipant(list, 'c1', anna).bookings;
    assert.equal(bookings.addParticipant(list, 'c2', anna).ok, true);
});

test('the 21st participant is rejected', () => {
    let list = bookings.addBooking([], 'c1');
    for (let index = 0; index < 20; index++) {
        list = bookings.addParticipant(list, 'c1', {name: `Person ${index}`, email: `p${index}@firma.de`}).bookings;
    }
    const result = bookings.addParticipant(list, 'c1', anna);
    assert.deepEqual([result.ok, result.error], [false, 'bookingFull']);
    assert.equal(bookings.remainingSeats(list[0]), 0);
});

test('an unknown booking is reported', () => {
    const result = bookings.addParticipant([], 'missing', anna);
    assert.deepEqual([result.ok, result.error], [false, 'unknownBooking']);
});

test('removing a participant frees a seat', () => {
    let list = bookings.addBooking([], 'c1');
    list = bookings.addParticipant(list, 'c1', anna).bookings;
    list = bookings.removeParticipant(list, 'c1', 'ANNA@firma.de');
    assert.equal(bookings.remainingSeats(list[0]), 20);
});

test('remaining seats reflect the participant count', () => {
    let list = bookings.addBooking([], 'c1');
    list = bookings.addParticipant(list, 'c1', anna).bookings;
    assert.equal(bookings.remainingSeats(list[0]), 19);
});

test('the company name is derived from the email domain', () => {
    assert.equal(bookings.companyNameFromEmail('anna@firma.de'), 'Firma');
    assert.equal(bookings.companyNameFromEmail('ANNA@Muster-Software.com'), 'Muster Software');
});

test('subdomains and second level country domains are skipped', () => {
    assert.equal(bookings.companyNameFromEmail('anna@mail.firma.de'), 'Firma');
    assert.equal(bookings.companyNameFromEmail('anna@firma.co.uk'), 'Firma');
});

test('free mail providers and invalid addresses give no company name', () => {
    assert.equal(bookings.companyNameFromEmail('anna@gmail.com'), '');
    assert.equal(bookings.companyNameFromEmail('anna@web.de'), '');
    assert.equal(bookings.companyNameFromEmail('keine-adresse'), '');
    assert.equal(bookings.companyNameFromEmail(''), '');
});

test('the company name comes from the first registered participant', () => {
    let list = bookings.addBooking([], 'c1');
    list = bookings.addParticipant(list, 'c1', anna).bookings;
    list = bookings.addParticipant(list, 'c1', {name: 'Ben', email: 'ben@andere.de'}).bookings;
    assert.equal(bookings.companyNameFromBookings(list), 'Firma');
});

test('the company name is empty without usable participants', () => {
    assert.equal(bookings.companyNameFromBookings([]), '');
    const empty = bookings.addBooking([], 'c1');
    assert.equal(bookings.companyNameFromBookings(empty), '');
    const privateMail = bookings.addParticipant(empty, 'c1', {name: 'Ben', email: 'ben@gmx.de'}).bookings;
    assert.equal(bookings.companyNameFromBookings(privateMail), '');
});
