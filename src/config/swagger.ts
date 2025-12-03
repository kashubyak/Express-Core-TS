import swaggerJsdoc, { Options } from 'swagger-jsdoc'

const options: Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Express Core API',
			version: '1.0.0',
		},
	},
	apis: ['./src/docs/*.yaml'],
}

const specs: object = swaggerJsdoc(options)

export default specs
