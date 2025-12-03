const userService = require('./users.service')

class UsersController {
	getAll = async (req, res, next) => {
		try {
			const users = await userService.getAllUsers()
			res.json(users)
		} catch (error) {
			next(error)
		}
	}

	create = async (req, res, next) => {
		try {
			const newUser = await userService.createUser(req.body)
			res.status(201).json(newUser)
		} catch (error) {
			next(error)
		}
	}

	getOne = async (req, res, next) => {
		try {
			const { id } = req.params
			const user = await userService.getUserById(id)
			if (!user) return res.status(404).json({ message: 'User not found' })
			res.json(user)
		} catch (error) {
			next(error)
		}
	}
}
module.exports = new UsersController()
