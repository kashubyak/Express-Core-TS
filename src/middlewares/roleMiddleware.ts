import { NextFunction, Request, Response } from 'express'
import ApiError from '../utils/ApiError'

const roleMiddleware = (requiredRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !requiredRoles.includes(req.user.role)) {
			return next(new ApiError(403, 'Access denied'))
		}
		next()
	}
}

export default roleMiddleware
