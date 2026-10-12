// Maps an HTTP status code to a short machine-readable error code
// used in the REST API error envelope: { success:false, error:{code,message} }
function statusToCode(status) {
    switch (status) {
        case 400: return 'BAD_REQUEST';
        case 401: return 'UNAUTHORIZED';
        case 403: return 'FORBIDDEN';
        case 404: return 'NOT_FOUND';
        case 409: return 'CONFLICT';
        case 422: return 'VALIDATION_ERROR';
        case 429: return 'RATE_LIMITED';
        case 503: return 'SERVICE_UNAVAILABLE';
        default: return 'INTERNAL_ERROR';
    }
}

function errorHandler(err, req, res, next) {
    const isApiRequest = req.path.startsWith('/api');

    let status = 500;
    let code = 'INTERNAL_ERROR';
    let message = err.message || 'Internal server error';

    if (err.name === 'ValidationError') {
        status = 400;
        code = 'VALIDATION_ERROR';
    } else if (err.name === 'CastError') {
        console.error(err);
        status = 400;
        code = 'INVALID_ID';
        message = 'Invalid ID';
    } else if (err.statusCode) {
        status = err.statusCode;
        code = statusToCode(status);
    }

    // REST API clients always get the JSON envelope.
    if (isApiRequest) {
        return res.status(status).json({
            success: false,
            error: { code, message }
        });
    }

    // Page routes keep their existing response shape (unchanged behavior).
    return res.status(status).json({ error: message });
}

module.exports = { errorHandler };
