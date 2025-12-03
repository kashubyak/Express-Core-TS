const ApiError = require('../utils/ApiError')

const notFoundHandler = (req, res, next) => {
	next(ApiError.NotFound('Route not found'))
}

module.exports = notFoundHandler
