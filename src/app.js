const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./config/swagger')
const logger = require('./utils/logger')
const requestId = require('./middlewares/requestId')
const notFoundHandler = require('./middlewares/notFoundHandler')
const errorHandler = require('./middlewares/errorHandler')
const authRouter = require('./modules/auth/auth.routes')
const usersRouter = require('./modules/users/users.routes')
const healthRouter = require('./modules/health/health.routes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(requestId)

app.use((req, res, next) => {
	logger.info(`Incoming Request`, {
		method: req.method,
		url: req.url,
		requestId: req.id,
	})
	next()
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use('/', healthRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
