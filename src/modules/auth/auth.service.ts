import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config/config'
import ApiError from '../../utils/ApiError'

interface RegisterDto {
	email: string
	password: string
	name: string
	role: string
}

interface TokenPayload {
	id: number
	role: string
}

class AuthService {
	generateTokens(payload: TokenPayload) {
		const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
			expiresIn: config.jwt.accessExpiresIn,
		})
		const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
			expiresIn: config.jwt.refreshExpiresIn,
		})
		return { accessToken, refreshToken }
	}

	async register(data: RegisterDto) {
		const { email, password, name, role } = data

		const existingUser = await usersRepository.findByEmail(email)
		if (existingUser) {
			throw ApiError.BadRequest('User with this email already exists')
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = await usersRepository.createUser({
			name,
			email,
			role,
			password: hashedPassword,
		})

		const tokens = this.generateTokens({ id: newUser.id, role: newUser.role })

		const { password: _, ...userWithoutPassword } = newUser

		return { user: userWithoutPassword, ...tokens }
	}

	async login(email: string, password: string) {
		const user = await usersRepository.findByEmail(email)
		if (!user) {
			throw ApiError.BadRequest('Invalid email or password')
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			throw ApiError.BadRequest('Invalid email or password')
		}

		const tokens = this.generateTokens({ id: user.id, role: user.role })

		const { password: _, ...userWithoutPassword } = user
		return { user: userWithoutPassword, ...tokens }
	}

	async refresh(refreshToken: string) {
		if (!refreshToken) {
			throw ApiError.Unauthorized()
		}

		try {
			const userData = jwt.verify(refreshToken, config.jwt.refreshSecret) as TokenPayload
			const tokens = this.generateTokens({ id: userData.id, role: userData.role })
			return tokens
		} catch (e) {
			throw ApiError.Unauthorized()
		}
	}
}

export default new AuthService()
