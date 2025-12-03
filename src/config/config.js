require('dotenv').config()

module.exports = {
	port: process.env.PORT || 3000,
	env: process.env.NODE_ENV || 'development',
	jwt: {
		accessSecret: process.env.JWT_ACCESS_SECRET,
		refreshSecret: process.env.JWT_REFRESH_SECRET,
		accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
		refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
	},
}
