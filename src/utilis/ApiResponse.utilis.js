class ApiResponse {

    constructor(statusCode, data, message = "success message from api response") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }