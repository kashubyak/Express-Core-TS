import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/config'
import ApiError from '../utils/ApiError'

interface UserPayload {
	id: number
	role: string
	iat?: number
	exp?: number
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization
		if (!authHeader) return next(ApiError.Unauthorized())

		const accessToken = authHeader.split(' ')[1]
		if (!accessToken) return next(ApiError.Unauthorized())

		const userData = jwt.verify(accessToken, config.jwt.accessSecret) as UserPayload

		req.user = userData
		next()
	} catch (e) {
		return next(ApiError.Unauthorized())
	}
}

export default authMiddleware
