const authService = require('../../modules/auth/auth.service')
const usersRepository = require('../../modules/users/users.repository')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ApiError = require('../../utils/ApiError')

jest.mock('../../modules/users/users.repository')
jest.mock('bcrypt')
jest.mock('jsonwebtoken')

describe('AuthService', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('register', () => {
		it('should register a new user successfully', async () => {
			const inputData = {
				email: 'luke@jedi.com',
				password: '123',
				name: 'Luke',
				role: 'Jedi',
			}
			const hashedPassword = 'hashed_password_123'
			const createdUser = { id: 1, ...inputData, password: hashedPassword }

			usersRepository.findByEmail.mockResolvedValue(null)
			bcrypt.hash.mockResolvedValue(hashedPassword)
			usersRepository.createUser.mockResolvedValue(createdUser)
			jwt.sign.mockReturnValue('mock_token')

			const result = await authService.register(inputData)

			expect(usersRepository.findByEmail).toHaveBeenCalledWith(inputData.email)
			expect(bcrypt.hash).toHaveBeenCalledWith(inputData.password, 10)
			expect(usersRepository.createUser).toHaveBeenCalled()

			expect(result.user).not.toHaveProperty('password')
			expect(result).toHaveProperty('accessToken', 'mock_token')
			expect(result).toHaveProperty('refreshToken', 'mock_token')
		})

		it('should throw error if user already exists', async () => {
			const inputData = { email: 'vader@sith.com' }
			usersRepository.findByEmail.mockResolvedValue({ id: 1, email: 'vader@sith.com' })

			await expect(authService.register(inputData)).rejects.toThrow(ApiError)
		})
	})

	describe('login', () => {
		const mockUser = {
			id: 1,
			email: 'yoda@jedi.com',
			password: 'hashed_secret',
			role: 'GrandMaster',
		}

		it('should login successfully with correct credentials', async () => {
			usersRepository.findByEmail.mockResolvedValue(mockUser)
			bcrypt.compare.mockResolvedValue(true)
			jwt.sign.mockReturnValue('mock_token')

			const result = await authService.login('yoda@jedi.com', 'secret')

			expect(result.user).toEqual(expect.objectContaining({ email: 'yoda@jedi.com' }))
			expect(result.user).not.toHaveProperty('password')
			expect(result.accessToken).toBeDefined()
		})

		it('should throw error if user not found', async () => {
			usersRepository.findByEmail.mockResolvedValue(null)

			await expect(authService.login('unknown@user.com', '123')).rejects.toThrow(
				'Invalid email or password',
			)
		})

		it('should throw error if password is wrong', async () => {
			usersRepository.findByEmail.mockResolvedValue(mockUser)
			bcrypt.compare.mockResolvedValue(false)

			await expect(authService.login('yoda@jedi.com', 'wrong_pass')).rejects.toThrow(
				'Invalid email or password',
			)
		})
	})

	describe('refresh', () => {
		it('should return new tokens if refresh token is valid', async () => {
			const payload = { id: 1, role: 'Jedi' }
			jwt.verify.mockReturnValue(payload)
			jwt.sign.mockReturnValue('new_mock_token')

			const result = await authService.refresh('valid_refresh_token')

			expect(jwt.verify).toHaveBeenCalled()
			expect(result).toEqual({
				accessToken: 'new_mock_token',
				refreshToken: 'new_mock_token',
			})
		})

		it('should throw Unauthorized if token is missing', async () => {
			await expect(authService.refresh(null)).rejects.toThrow(ApiError)
		})

		it('should throw Unauthorized if token is invalid', async () => {
			jwt.verify.mockImplementation(() => {
				throw new Error('Invalid token')
			})

			await expect(authService.refresh('bad_token')).rejects.toThrow(ApiError)
		})
	})
})
