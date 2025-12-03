import { NextFunction, Request, Response } from 'express'
import logger from '../../utils/logger'

class HealthController {
	getHealth = (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(200).json({ status: 'OK', uptime: process.uptime() })
		} catch (error) {
			logger.error('Health check failed', { error })
			next(error)
		}
	}

	getPing = (req: Request, res: Response, next: NextFunction) => {
		try {
			res.send('pong')
		} catch (error) {
			logger.error('Ping failed', { error })
			next(error)
		}
	}
}

export default new HealthController()
