const StatusCode = {
    SUCCESS: 200,
    CREATED: 201,
}
const ReasonStatusCode = {
    SUCCESS: "Success",
    CREATED: "Created success",
}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.SUCCESS, reasonStatusCode = ReasonStatusCode.SUCCESS, metadata = {} }) {
        this.message = message ? message : reasonStatusCode
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(
            this
        )
    }
}

module.exports = {
    SuccessResponse
}
