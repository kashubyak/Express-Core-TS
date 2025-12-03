const logger = require('../../utils/logger')

class HealthController {
	getHealth = (req, res, next) => {
		try {
			res.status(200).json({ status: 'OK', uptime: process.uptime() })
		} catch (error) {
			logger.error('Health check failed', { error })
			next(error)
		}
	}

	getPing = (req, res, next) => {
		try {
			res.send('pong')
		} catch (error) {
			logger.error('Ping failed', { error })
			next(error)
		}
	}
}

module.exports = new HealthController()
