class ApiError extends Error {
	constructor(status, message, error = []) {
		super(message)
		this.status = status
		this.error = error
	}
	static BadRequest(message, error = []) {
		return new ApiError(400, message, error)
	}
	static NotFound(message, error = []) {
		return new ApiError(404, message, error)
	}
	static Internal(message = 'Internal Server Error') {
		return new ApiError(500, message)
	}
	static Unauthorized() {
		return new ApiError(401, 'User not authorized')
	}
}
module.exports = ApiError
