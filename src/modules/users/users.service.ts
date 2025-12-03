import { Prisma, User } from '@prisma/client'
import logger from '../../utils/logger'
import redisClient from '../../utils/redis'
import usersRepository from './users.repository'

class UsersService {
	async getAllUsers(): Promise<User[]> {
		return usersRepository.getAllUsers()
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		return usersRepository.createUser(data)
	}

	async getUserById(id: string): Promise<User | null> {
		const numericId = parseInt(id, 10)
		const cacheKey = `user:${numericId}`

		const cachedData = await redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Serving user ${id} from REDIS`)
			return JSON.parse(cachedData) as User
		}

		logger.info(`Serving user ${id} from DB`)
		const user = await usersRepository.findById(numericId)

		if (user) await redisClient.setEx(cacheKey, 3600, JSON.stringify(user))
		return user
	}
}

export default new UsersService()
