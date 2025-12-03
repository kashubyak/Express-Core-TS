import { Prisma, User } from '@prisma/client'
import prisma from '../../utils/prisma'

class UsersRepository {
	async getAllUsers(): Promise<User[]> {
		return prisma.user.findMany({
			orderBy: { id: 'asc' },
		})
	}

	async findByEmail(email: string): Promise<User | null> {
		return prisma.user.findUnique({
			where: { email },
		})
	}

	async findById(id: number): Promise<User | null> {
		return prisma.user.findUnique({
			where: { id },
		})
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
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

export default new UsersRepository()
