{
const {test, assert, tenantReport} = typeof require === 'function'
    ? {
        test: require('node:test'),
        assert: require('node:assert/strict'),
        tenantReport: require('../shared/tenant-report.js')
    }
    : window.seyItTestContext;

const validName = 'Products_2026-05-27T11_24_34+02_00.csv';

test('the maximum file size is 5 MB', () => {
    assert.equal(tenantReport.MAX_FILE_SIZE_BYTES, 5 * 1024 * 1024);
});

test('the exported csv file name is accepted', () => {
    assert.deepEqual(tenantReport.validateReportFile({name: validName, size: 2048}), {ok: true});
});

test('xlsx and xls files are accepted', () => {
    assert.equal(tenantReport.validateReportFile({name: 'report.xlsx', size: 10}).ok, true);
    assert.equal(tenantReport.validateReportFile({name: 'report.xls', size: 10}).ok, true);
});

test('the file extension check ignores case', () => {
    assert.equal(tenantReport.validateReportFile({name: 'REPORT.CSV', size: 10}).ok, true);
});

test('other file types are rejected', () => {
    const result = tenantReport.validateReportFile({name: 'report.pdf', size: 10});
    assert.deepEqual([result.ok, result.error], [false, 'invalidFileType']);
});

test('a name without extension is rejected', () => {
    assert.equal(tenantReport.validateReportFile({name: 'report', size: 10}).error, 'invalidFileType');
});

test('an empty file is rejected', () => {
    const result = tenantReport.validateReportFile({name: validName, size: 0});
    assert.deepEqual([result.ok, result.error], [false, 'emptyFile']);
});

test('a file above the limit is rejected', () => {
    const result = tenantReport.validateReportFile({name: validName, size: 5 * 1024 * 1024 + 1});
    assert.deepEqual([result.ok, result.error], [false, 'fileTooLarge']);
});

test('a missing file is rejected', () => {
    assert.equal(tenantReport.validateReportFile(null).error, 'noFile');
});

test('sizes are formatted for display', () => {
    assert.equal(tenantReport.formatFileSize(512), '512 B');
    assert.equal(tenantReport.formatFileSize(2048), '2.0 KB');
    assert.equal(tenantReport.formatFileSize(3 * 1024 * 1024), '3.0 MB');
});
}
