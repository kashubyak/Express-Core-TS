import { NextFunction, Request, Response } from 'express'
import userService from './users.service'

class UsersController {
	getAll = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const users = await userService.getAllUsers()
			res.json(users)
		} catch (error) {
			next(error)
		}
	}

	create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const newUser = await userService.createUser(req.body)
			res.status(201).json(newUser)
		} catch (error) {
			next(error)
		}
	}

	getOne = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params
			const user = await userService.getUserById(id)

			if (!user) {
				res.status(404).json({ message: 'User not found' })
				return
			}
			res.json(user)
		} catch (error) {
			next(error)
		}
	}
}

export default new UsersController()
