



class ApiError extends Error {


    constructor(statusCode, message = "error from api error ", errors = [], stack = "") {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        this.name = this.constructor.name; // optional but helpful
        // this.functionName = functionName;

        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}


export { ApiError }