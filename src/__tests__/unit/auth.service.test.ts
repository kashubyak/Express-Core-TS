import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import authService from '../../modules/auth/auth.service'
import usersRepository from '../../modules/users/users.repository'
import ApiError from '../../utils/ApiError'

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
			const createdUser = {
				id: 1,
				...inputData,
				password: hashedPassword,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			;(usersRepository.findByEmail as jest.Mock).mockResolvedValue(null)
			;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword as never)
			;(usersRepository.createUser as jest.Mock).mockResolvedValue(createdUser)
			;(jwt.sign as jest.Mock).mockReturnValue('mock_token')

			const result = await authService.register(inputData)

			expect(usersRepository.findByEmail).toHaveBeenCalledWith(inputData.email)
			expect(bcrypt.hash).toHaveBeenCalledWith(inputData.password, 10)
			expect(usersRepository.createUser).toHaveBeenCalled()

			expect(result.user).not.toHaveProperty('password')
			expect(result).toHaveProperty('accessToken', 'mock_token')
			expect(result).toHaveProperty('refreshToken', 'mock_token')
		})

		it('should throw error if user already exists', async () => {
			const inputData = {
				email: 'vader@sith.com',
				password: '123',
				name: 'Vader',
				role: 'Sith',
			}

			;(usersRepository.findByEmail as jest.Mock).mockResolvedValue({
				id: 1,
				email: inputData.email,
			})

			await expect(authService.register(inputData)).rejects.toThrow(ApiError)
		})
	})

	describe('login', () => {
		const mockUser = {
			id: 1,
			email: 'yoda@jedi.com',
			password: 'hashed_secret',
			role: 'GrandMaster',
			name: 'Yoda',
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		it('should login successfully with correct credentials', async () => {
			;(usersRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser)
			;(bcrypt.compare as jest.Mock).mockResolvedValue(true as never)
			;(jwt.sign as jest.Mock).mockReturnValue('mock_token')

			const result = await authService.login('yoda@jedi.com', 'secret')

			expect(result.user).toEqual(expect.objectContaining({ email: 'yoda@jedi.com' }))
			expect(result.user).not.toHaveProperty('password')
			expect(result.accessToken).toBeDefined()
		})

		it('should throw error if user not found', async () => {
			;(usersRepository.findByEmail as jest.Mock).mockResolvedValue(null)

			await expect(authService.login('unknown@user.com', '123')).rejects.toThrow(
				'Invalid email or password',
			)
		})

		it('should throw error if password is wrong', async () => {
			;(usersRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser)
			;(bcrypt.compare as jest.Mock).mockResolvedValue(false as never)

			await expect(authService.login('yoda@jedi.com', 'wrong_pass')).rejects.toThrow(
				'Invalid email or password',
			)
		})
	})

	describe('refresh', () => {
		it('should return new tokens if refresh token is valid', async () => {
			const payload = { id: 1, role: 'Jedi' }
			;(jwt.verify as jest.Mock).mockReturnValue(payload)
			;(jwt.sign as jest.Mock).mockReturnValue('new_mock_token')

			const result = await authService.refresh('valid_refresh_token')

			expect(jwt.verify).toHaveBeenCalled()
			expect(result).toEqual({
				accessToken: 'new_mock_token',
				refreshToken: 'new_mock_token',
			})
		})

		it('should throw Unauthorized if token is missing', async () => {
			// @ts-ignore
			await expect(authService.refresh(null)).rejects.toThrow(ApiError)
		})

		it('should throw Unauthorized if token is invalid', async () => {
			;(jwt.verify as jest.Mock).mockImplementation(() => {
				throw new Error('Invalid token')
			})

			await expect(authService.refresh('bad_token')).rejects.toThrow(ApiError)
		})
	})
})
