const app = require('./src/app')
const config = require('./src/config/config')
const redisClient = require('./src/utils/redis')
const logger = require('./src/utils/logger')

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
