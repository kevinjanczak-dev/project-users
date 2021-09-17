import express, { Response, Request, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import { User } from '../entity/User'
import ValidateBodyMiddleware from '../middlewares/ValidateBodyMiddleware'
import UserSchema from '../schemas/UserSchema'
import bcrypt from 'bcrypt'
import { generateToken } from '../tools/tokenServices'

type RequestWithUser = Request & {
    user: User
}

async function login(req: Request, res: Response) {
    const userRepo = getRepository(User)

    const { email, password } = req.body

    if(!email || !password) return res.status(400).send()

    const user = await userRepo.findOne({
        where: {
            email
        },
        select: ['email', 'password', 'name', 'id', 'permissions']
    })

    if(!user) return res.status(401).send()

    if(!await bcrypt.compare(password, user.password)) return res.status(401).send()

    user.password = undefined

    return res.status(200).json({
        ...user,
        token: generateToken(user)
    })
}

async function create(req: Request<any,any,User>, res: Response) {
    const userRepo = getRepository(User)
    const newUser = userRepo.create(req.body)
    const user = await userRepo.save(newUser)
    return res.status(200).json(user)
}

async function update(req: RequestWithUser, res: Response) {
    const id = req.params.id

    const userRepo = getRepository(User)

    const updatedUser = await userRepo.save({
        id,
        ...req.user
    })

    return res.status(200).json(updatedUser)
}

async function getAll(req: Request, res: Response) {
    const userRepo = getRepository(User)
    const users = await userRepo.find()

    return res.status(200).json(users)
}

async function getByPk(req: RequestWithUser, res: Response) {
    return res.status(200).json(req.user)
}

async function remove(req: RequestWithUser, res: Response) {
    const userRepo = getRepository(User)

    await userRepo.remove(req.user)

    return res.status(200).send()
}

async function userExistsMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    const id = req.params.id
    const userRepo = getRepository(User)

    const user = await userRepo.findOne(id)

    if(!user) return res.status(400).send()

    req.user = user

    next()
}



const userRoute = express.Router()

userRoute.post('/login', login)
userRoute.post('/', ValidateBodyMiddleware(UserSchema), create)
userRoute.get('/', getAll)
userRoute.use('/:id', userExistsMiddleware)
userRoute.get('/:id', getByPk)
userRoute.delete('/:id', remove)
userRoute.put('/:id', ValidateBodyMiddleware(UserSchema), update)

export default userRoute