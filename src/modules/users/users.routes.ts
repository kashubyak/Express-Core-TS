const express = require('express')
const Joi = require('joi')
const router = express.Router()
const usersController = require('./users.controller')
const validateBody = require('../../middlewares/validateBody')
const authMiddleware = require('../../middlewares/authMiddleware')
const roleMiddleware = require('../../middlewares/roleMiddleware')

const createUserSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	role: Joi.string().valid('Jedi', 'Senator', 'Sith').required(),
})

router.get('/', authMiddleware, roleMiddleware(['Jedi', 'Sith']), usersController.getAll)
router.post('/', validateBody(createUserSchema), usersController.create)
router.get('/:id', authMiddleware, usersController.getOne)

module.exports = router
