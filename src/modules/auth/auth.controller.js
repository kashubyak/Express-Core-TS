const authService = require('./auth.service')

class AuthController {
	register = async (req, res, next) => {
		try {
			const data = await authService.register(req.body)
			res.status(201).json(data)
		} catch (e) {
			next(e)
		}
	}

	login = async (req, res, next) => {
		try {
			const { email, password } = req.body
			const data = await authService.login(email, password)
			res.json(data)
		} catch (e) {
			next(e)
		}
	}

	refresh = async (req, res, next) => {
		try {
			const { refreshToken } = req.body
			const tokens = await authService.refresh(refreshToken)
			res.json(tokens)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new AuthController()
