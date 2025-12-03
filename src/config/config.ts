import dotenv from 'dotenv'
dotenv.config()

interface JwtConfig {
	accessSecret: string
	refreshSecret: string
	accessExpiresIn: string
	refreshExpiresIn: string
}

interface Config {
	port: string | number
	env: string
	jwt: JwtConfig
}

const config: Config = {
	port: process.env.PORT || 3000,
	env: process.env.NODE_ENV || 'development',
	jwt: {
		accessSecret: (process.env.JWT_ACCESS_SECRET as string) || 'default_access_secret',
		refreshSecret: (process.env.JWT_REFRESH_SECRET as string) || 'default_refresh_secret',
		accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
		refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
	},
}

export default config
