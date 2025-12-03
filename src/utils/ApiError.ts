export default class ApiError extends Error {
	status: number
	errors: unknown[]

	constructor(status: number, message: string, errors: unknown[] = []) {
		super(message)
		this.status = status
		this.errors = errors
	}

	static BadRequest(message: string, errors: unknown[] = []) {
		return new ApiError(400, message, errors)
	}

	static NotFound(message: string = 'Resource not found', errors: unknown[] = []) {
		return new ApiError(404, message, errors)
	}

	static Internal(message: string = 'Internal Server Error') {
		return new ApiError(500, message)
	}

	static Unauthorized() {
		return new ApiError(401, 'User not authorized')
	}
}
