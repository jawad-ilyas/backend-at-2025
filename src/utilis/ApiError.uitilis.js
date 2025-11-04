



class ApiError extends Error {


    constructor(statusCode, message = "error from api error ", errors = [], stack = "") {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = faslse
        this.errors = errors

        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}


export { ApiError }