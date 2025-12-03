import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'
import ApiError from '../utils/ApiError'

const validateBody = (schema: Schema) => {
	return (req: Request, res: Response, next: NextFunction) => {
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

export default validateBody
