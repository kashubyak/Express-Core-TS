export interface UserPayload {
	id: number
	role: string
	email?: string
	iat?: number
	exp?: number
}

declare global {
	namespace Express {
		interface Request {
			id?: string
			user?: UserPayload
		}
	}
}
