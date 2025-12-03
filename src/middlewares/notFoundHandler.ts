import { NextFunction, Request, Response } from 'express'
import ApiError from '../utils/ApiError'

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	next(ApiError.NotFound('Route not found'))
}

export default notFoundHandler
