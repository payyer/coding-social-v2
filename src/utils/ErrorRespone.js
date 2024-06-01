const StatusCode = {
    FORBIDEN: 403,
    CONFLICT: 409,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
}

const ReasonStatusCode = {
    FORBIDEN: "FORBIDEN error",
    CONFLICT: "Conflict error",
    NOT_FOUND: "Not found!",
    UNAUTHORIZED: "Unauthorized!"
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDEN, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode)
    }
}

module.exports = {
    BadRequestError,
}