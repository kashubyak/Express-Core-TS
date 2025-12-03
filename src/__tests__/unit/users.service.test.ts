import usersRepository from '../../modules/users/users.repository'
import usersService from '../../modules/users/users.service'
import redisClient from '../../utils/redis'

jest.mock('../../modules/users/users.repository')
jest.mock('../../utils/redis')

describe('UsersService', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('getAllUsers', () => {
		it('should return an array of users', async () => {
			const mockUsers = [
				{
					id: 1,
					name: 'Anakin',
					role: 'Jedi',
					email: 'a@a.com',
					password: 'hash',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 2,
					name: 'Palpatine',
					role: 'Senator',
					email: 'p@p.com',
					password: 'hash',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]

			;(usersRepository.getAllUsers as jest.Mock).mockResolvedValue(mockUsers)

			const result = await usersService.getAllUsers()

			expect(result).toEqual(mockUsers)
			expect(usersRepository.getAllUsers).toHaveBeenCalledTimes(1)
		})
	})

	describe('getUserById', () => {
		it('should return user from REDIS if cached', async () => {
			const cachedUser = { id: 1, name: 'Obi-Wan' }
			;(redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedUser))

			const result = await usersService.getUserById('1')

			expect(result).toEqual(cachedUser)
			expect(redisClient.get).toHaveBeenCalledWith('user:1')
			expect(usersRepository.findById).not.toHaveBeenCalled()
		})

		it('should return user from DB if NOT in cache', async () => {
			;(redisClient.get as jest.Mock).mockResolvedValue(null)

			const dbUser = { id: 1, name: 'Obi-Wan', email: 'o@o.com' }
			;(usersRepository.findById as jest.Mock).mockResolvedValue(dbUser)

			const result = await usersService.getUserById('1')

			expect(result).toEqual(dbUser)
			expect(usersRepository.findById).toHaveBeenCalledWith(1)
			expect(redisClient.setEx).toHaveBeenCalled()
		})
	})
})
