import { NextFunction, Request, Response } from 'express'
import config from '../config/config'
import ApiError from '../utils/ApiError'

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err)

	if (err instanceof ApiError) {
		return res.status(err.status).json({
			message: err.message,
			errors: err.errors,
		})
	}

	return res.status(500).json({
		message: 'Something went wrong',
		error: config.env === 'development' ? err.message : undefined,
	})
}

export default errorHandler
