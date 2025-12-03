const ApiError = require('../utils/ApiError')

module.exports = function (requiredRoles) {
	return function (req, res, next) {
		if (!requiredRoles.includes(req.user.role))
			return next(new ApiError(403, 'Access denied'))
		next()
	}
}
