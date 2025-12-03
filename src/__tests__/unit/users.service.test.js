const usersService = require('../../modules/users/users.service')
const usersRepository = require('../../modules/users/users.repository')
const redisClient = require('../../utils/redis')

jest.mock('../../modules/users/users.repository')
jest.mock('../../utils/redis')

describe('UsersService', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('getAllUsers', () => {
		it('should return an array of users', async () => {
			const mockUsers = [
				{ id: 1, name: 'Anakin', role: 'Jedi' },
				{ id: 2, name: 'Palpatine', role: 'Senator' },
			]
			usersRepository.getAllUsers.mockResolvedValue(mockUsers)

			const result = await usersService.getAllUsers()

			expect(result).toEqual(mockUsers)
			expect(usersRepository.getAllUsers).toHaveBeenCalledTimes(1)
		})
	})

	describe('getUserById', () => {
		it('should return user from REDIS if cached', async () => {
			const cachedUser = { id: 1, name: 'Obi-Wan' }
			redisClient.get.mockResolvedValue(JSON.stringify(cachedUser))

			const result = await usersService.getUserById(1)

			expect(result).toEqual(cachedUser)
			expect(redisClient.get).toHaveBeenCalledWith('user:1')
			expect(usersRepository.findById).not.toHaveBeenCalled()
		})

		it('should return user from DB if NOT in cache', async () => {
			redisClient.get.mockResolvedValue(null)
			const dbUser = { id: 1, name: 'Obi-Wan' }
			usersRepository.findById.mockResolvedValue(dbUser)

			const result = await usersService.getUserById(1)

			expect(result).toEqual(dbUser)
			expect(usersRepository.findById).toHaveBeenCalledWith(1)
			expect(redisClient.setEx).toHaveBeenCalled()
		})
	})
})
