const request = require('supertest')
const app = require('../../app')
const prisma = require('../../utils/prisma')
const redisClient = require('../../utils/redis')

let accessToken = ''
const testUser = {
	email: `test_${Date.now()}@integration.com`,
	password: 'password123',
	name: 'Integration Tester',
	role: 'Jedi',
}

describe('Integration Tests (Auth & Users)', () => {
	beforeAll(async () => {
		if (!redisClient.isOpen) {
			await redisClient.connect()
		}
		await prisma.user.deleteMany({ where: { email: testUser.email } })
	})

	afterAll(async () => {
		await prisma.user.deleteMany({ where: { email: testUser.email } })
		await prisma.$disconnect()
		await redisClient.quit()
	})

	it('POST /auth/register should create a new user', async () => {
		const res = await request(app).post('/auth/register').send(testUser)

		expect(res.statusCode).toEqual(201)
		expect(res.body.user).toHaveProperty('email', testUser.email)
		expect(res.body).toHaveProperty('accessToken')
	})

	it('POST /auth/login should return tokens', async () => {
		const res = await request(app).post('/auth/login').send({
			email: testUser.email,
			password: testUser.password,
		})

		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('accessToken')

		accessToken = res.body.accessToken
	})

	it('GET /users should fail without token', async () => {
		const res = await request(app).get('/users')
		expect(res.statusCode).toEqual(401)
	})

	it('GET /users should return list of users with valid token', async () => {
		const res = await request(app)
			.get('/users')
			.set('Authorization', `Bearer ${accessToken}`)

		expect(res.statusCode).toEqual(200)
		expect(Array.isArray(res.body)).toBeTruthy()
		const found = res.body.find(u => u.email === testUser.email)
		expect(found).toBeDefined()
	})
})
