const ApiError = require('../utils/ApiError')
const config = require('../config/config')

const ErrorHandler = (err, req, res, next) => {
	console.error(err)
	if (err instanceof ApiError) {
		return res.status(err.status).json({
			message: err.message,
			error: err.error,
		})
	}

	return res.status(500).json({
		message: 'Something went wrong',
		error: config.env === 'development' ? err.message : undefined,
	})
}
module.exports = ErrorHandler
