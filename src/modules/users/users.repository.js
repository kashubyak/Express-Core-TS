const prisma = require('../../utils/prisma')

class UsersRepository {
	async getAllUsers() {
		return prisma.user.findMany({
			orderBy: { id: 'asc' },
		})
	}

	async findByEmail(email) {
		return prisma.user.findUnique({
			where: { email },
		})
	}

	async findById(id) {
		return prisma.user.findUnique({
			where: { id: parseInt(id) },
		})
	}

	async createUser(data) {
		return prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				password: data.password,
				role: data.role,
			},
		})
	}
}

module.exports = new UsersRepository()
