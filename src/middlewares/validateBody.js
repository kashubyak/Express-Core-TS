const ApiError = require('../utils/ApiError')

const validateBody = schema => {
	return (req, res, next) => {
		const { error } = schema.validate(req.body, { abortEarly: false })

		if (error) {
			const errors = error.details.map(detail => ({
				field: detail.path.join('.'),
				message: detail.message,
			}))
			next(ApiError.BadRequest('Validation Error', errors))
			return
		}
		next()
	}
}

module.exports = validateBody
