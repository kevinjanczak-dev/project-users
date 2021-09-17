import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { User } from '../entity/User';
import settings from '../../settings.json'

export function generateToken(user: User): string {
    return jwt.sign({
        name: user.name,
        id: user.id,
        email: user.email
    }, settings.secret)
}

export function validateToken(token: string): number | undefined {
    try {
        const result = jwt.verify(token, settings.secret) as Record<string, any>

        if(!result) return undefined

        return parseInt(result.id)
    }
    catch {
        return undefined
    }
}