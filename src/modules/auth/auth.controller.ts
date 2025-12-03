import { NextFunction, Request, Response } from 'express'
import authService from './auth.service'

class AuthController {
	register = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await authService.register(req.body)
			res.status(201).json(data)
		} catch (e) {
			next(e)
		}
	}

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body
			const data = await authService.login(email, password)
			res.json(data)
		} catch (e) {
			next(e)
		}
	}

	refresh = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { refreshToken } = req.body
			const tokens = await authService.refresh(refreshToken)
			res.json(tokens)
		} catch (e) {
			next(e)
		}
	}
}

export default new AuthController()
