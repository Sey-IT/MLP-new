{
const {test, assert, engagement} = typeof require === 'function'
    ? {
        test: require('node:test'),
        assert: require('node:assert/strict'),
        engagement: require('../shared/landing-engagement.js')
    }
    : window.seyItTestContext;

const validCheck = {
    email: 'it@beispiel.de',
    licenseDetails: 'Microsoft 365 E3, 50 Lizenzen',
    softwareDetails: 'Adobe Acrobat, SAP'
};

test('a complete free check request is valid', () => {
    assert.deepEqual(engagement.validateFreeCheck(validCheck), {ok: true, errors: {}});
});

test('an invalid email is reported', () => {
    const result = engagement.validateFreeCheck({...validCheck, email: 'keine-mail'});
    assert.equal(result.ok, false);
    assert.equal(result.errors.email, 'invalidEmail');
});

test('empty licenses and software are reported', () => {
    const result = engagement.validateFreeCheck({...validCheck, licenseDetails: '  ', softwareDetails: ''});
    assert.equal(result.errors.licenseDetails, 'required');
    assert.equal(result.errors.softwareDetails, 'required');
});

test('a rating must be a whole number from 1 to 5', () => {
    [1, 3, 5].forEach(value => assert.equal(engagement.isValidRating(value), true));
    [0, 6, 2.5, '4', null].forEach(value => assert.equal(engagement.isValidRating(value), false));
});

test('the rating summary computes count and rounded average', () => {
    assert.deepEqual(engagement.summarizeRatings([5, 4, 4]), {count: 3, average: 4.3});
});

test('the rating summary of no ratings is empty', () => {
    assert.deepEqual(engagement.summarizeRatings([]), {count: 0, average: 0});
});

test('invalid stored ratings are ignored in the summary', () => {
    assert.deepEqual(engagement.summarizeRatings([5, 9, 'x', 3]), {count: 2, average: 4});
});
}
