const express = require('express')
const router = express.Router()
const authController = require('./auth.controller')
const validateBody = require('../../middlewares/validateBody')
const Joi = require('joi')

const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	name: Joi.string().required(),
	role: Joi.string().valid('Jedi', 'Sith', 'Senator').default('Jedi'),
})

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
})

router.post('/register', validateBody(registerSchema), authController.register)
router.post('/login', validateBody(loginSchema), authController.login)
router.post('/refresh', authController.refresh)

module.exports = router
