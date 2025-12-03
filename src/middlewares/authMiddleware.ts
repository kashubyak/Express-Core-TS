const jwt = require('jsonwebtoken')
const config = require('../config/config')
const ApiError = require('../utils/ApiError')

module.exports = function (req, res, next) {
	try {
		const authHeader = req.headers.authorization
		if (!authHeader) return next(ApiError.Unauthorized())

		const accessToken = authHeader.split(' ')[1]
		if (!accessToken) return next(ApiError.Unauthorized())

		const userData = jwt.verify(accessToken, config.jwt.accessSecret)

		req.user = userData
		next()
	} catch (e) {
		return next(ApiError.Unauthorized())
	}
}
