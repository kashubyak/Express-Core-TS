import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

const requestId = (req: Request, res: Response, next: NextFunction) => {
	req.id = (req.headers['x-request-id'] as string) || uuidv4()

	res.setHeader('x-request-id', req.id!)
	next()
}

export default requestId
