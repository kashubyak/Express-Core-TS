import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import swaggerSpecs from './config/swagger'
import logger from './utils/logger'

import errorHandler from './middlewares/errorHandler'
import notFoundHandler from './middlewares/notFoundHandler'
import requestId from './middlewares/requestId'

import authRouter from './modules/auth/auth.routes'
import healthRouter from './modules/health/health.routes'
import usersRouter from './modules/users/users.routes'

const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(requestId)

app.use((req: Request, res: Response, next: NextFunction) => {
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

export default app
