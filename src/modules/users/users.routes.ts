import { Router } from 'express'
import Joi from 'joi'
import authMiddleware from '../../middlewares/authMiddleware'
import roleMiddleware from '../../middlewares/roleMiddleware'
import validateBody from '../../middlewares/validateBody'
import usersController from './users.controller'

const router = Router()

const createUserSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	role: Joi.string().valid('Jedi', 'Senator', 'Sith').required(),
})

router.get('/', authMiddleware, roleMiddleware(['Jedi', 'Sith']), usersController.getAll)
router.post('/', validateBody(createUserSchema), usersController.create)
router.get('/:id', authMiddleware, usersController.getOne)

export default router
