{
const {test, assert, share} = typeof require === 'function'
    ? {
        test: require('node:test'),
        assert: require('node:assert/strict'),
        share: require('../shared/share-links.js')
    }
    : window.seyItTestContext;

const text = 'Wir nehmen am Workshop teil & freuen uns!';
const url = 'https://sey-it.com/';

test('linkedin link carries the encoded page url', () => {
    const {linkedin} = share.buildShareLinks(text, url);
    assert.equal(linkedin, 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fsey-it.com%2F');
});

test('facebook link carries the encoded page url and text', () => {
    const {facebook} = share.buildShareLinks(text, url);
    assert.equal(
        facebook,
        'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsey-it.com%2F&quote='
        + encodeURIComponent(text)
    );
});

test('instagram has no share url and opens the profile page', () => {
    const {instagram} = share.buildShareLinks(text, url);
    assert.equal(instagram, 'https://www.instagram.com/');
});

test('share text names the workshop and its date', () => {
    assert.equal(
        share.buildShareText('Microsoft License Pro Workshop', '18.11.2026'),
        'Wir nehmen am Microsoft License Pro Workshop der sey-IT am 18.11.2026 teil.'
    );
});

test('the english share text names the workshop and its date', () => {
    assert.equal(
        share.buildShareText('Microsoft License Pro Workshop', '18 November 2026', 'en'),
        'We are attending the Microsoft License Pro Workshop by sey-IT on 18 November 2026.'
    );
});
}
