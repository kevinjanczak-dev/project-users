import { NextFunction, Request, Response } from "express"
import { getRepository } from "typeorm"
import { User } from "../entity/User"
import { validateToken } from "../tools/tokenServices"

export default function AuthMiddleware(permission: string = '') {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authorization = req.headers['authorization']

        if (!authorization) return res.status(401).send()

        if (!authorization.includes('Bearer')) return res.status(401).send()

        const [, token] = authorization.split(' ')

        if (!token) return res.status(401).send()

        const id = validateToken(token)

        if (!id) return res.status(401).send()

        const userRepo = getRepository(User)

        const user = await userRepo.findOne({ id })

        if (!user) return res.status(401).send()

        if (permission && !(user.permissions.includes('MASTER') || user.permissions.includes(permission))) {
            return res.status(401).send()
        }

        return next()
    }
}