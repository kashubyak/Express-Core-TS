import app from './src/app'
import config from './src/config/config'
import logger from './src/utils/logger'
import redisClient from './src/utils/redis'

const startServer = async () => {
	try {
		await redisClient.connect()
		app.listen(config.port, () => {
			logger.info(`Server is running on port ${config.port} in ${config.env} mode!`)
		})
	} catch (error) {
		logger.error('Failed to start server:', { error })
		process.exit(1)
	}
}

startServer()
