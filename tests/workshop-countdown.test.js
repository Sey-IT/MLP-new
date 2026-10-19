{
const {test, assert, countdown} = typeof require === 'function'
    ? {
        test: require('node:test'),
        assert: require('node:assert/strict'),
        countdown: require('../shared/workshop-countdown.js')
    }
    : window.seyItTestContext;

const at = value => new Date(value);

test('remaining time is split into days, hours, minutes and seconds', () => {
    const remaining = countdown.splitRemainingTime(at('2026-11-18T09:00:00'), at('2026-11-15T07:58:55'));
    assert.deepEqual(remaining, {days: 3, hours: 1, minutes: 1, seconds: 5});
});

test('the remaining time is zero once the start has passed', () => {
    const remaining = countdown.splitRemainingTime(at('2026-11-18T09:00:00'), at('2026-11-18T09:00:01'));
    assert.deepEqual(remaining, {days: 0, hours: 0, minutes: 0, seconds: 0});
});

test('the next start is the earliest start in the future', () => {
    const starts = [at('2026-11-25T09:00:00'), at('2026-11-18T09:00:00')];
    assert.deepEqual(countdown.findNextStart(starts, at('2026-10-19T12:00:00')), at('2026-11-18T09:00:00'));
});

test('past starts are ignored when looking for the next start', () => {
    const starts = [at('2026-11-18T09:00:00'), at('2026-11-25T09:00:00')];
    assert.deepEqual(countdown.findNextStart(starts, at('2026-11-20T12:00:00')), at('2026-11-25T09:00:00'));
});

test('no next start is reported when all starts have passed or none exist', () => {
    assert.equal(countdown.findNextStart([at('2026-11-18T09:00:00')], at('2026-12-01T00:00:00')), null);
    assert.equal(countdown.findNextStart([], at('2026-10-19T12:00:00')), null);
});

test('the input list of starts is not mutated', () => {
    const starts = [at('2026-11-25T09:00:00'), at('2026-11-18T09:00:00')];
    countdown.findNextStart(starts, at('2026-10-19T12:00:00'));
    assert.deepEqual(starts, [at('2026-11-25T09:00:00'), at('2026-11-18T09:00:00')]);
});

test('days until the start count calendar days', () => {
    assert.equal(countdown.daysUntil(at('2026-11-18T09:00:00'), at('2026-10-19T15:12:00')), 30);
});

test('the day count drops by one at midnight', () => {
    const start = at('2026-11-18T09:00:00');
    assert.equal(countdown.daysUntil(start, at('2026-10-19T23:59:59')), 30);
    assert.equal(countdown.daysUntil(start, at('2026-10-20T00:00:01')), 29);
});

test('the day count is zero on the day of the workshop and never negative', () => {
    const start = at('2026-11-18T09:00:00');
    assert.equal(countdown.daysUntil(start, at('2026-11-18T07:00:00')), 0);
    assert.equal(countdown.daysUntil(start, at('2026-11-20T07:00:00')), 0);
});

test('the day count stays correct across the end of daylight saving time', () => {
    assert.equal(countdown.daysUntil(at('2026-11-18T09:00:00'), at('2026-10-24T12:00:00')), 25);
});
}
