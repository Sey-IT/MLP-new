(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.seyItTenantReport = api;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
    const ALLOWED_EXTENSIONS = ['csv', 'xlsx', 'xls'];

    function validateReportFile(file) {
        if (!file) return {ok: false, error: 'noFile'};

        const extension = String(file.name || '').split('.').pop().toLowerCase();
        if (!String(file.name || '').includes('.') || !ALLOWED_EXTENSIONS.includes(extension)) {
            return {ok: false, error: 'invalidFileType'};
        }
        if (file.size <= 0) return {ok: false, error: 'emptyFile'};
        if (file.size > MAX_FILE_SIZE_BYTES) return {ok: false, error: 'fileTooLarge'};
        return {ok: true};
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return {MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS, validateReportFile, formatFileSize};
});
