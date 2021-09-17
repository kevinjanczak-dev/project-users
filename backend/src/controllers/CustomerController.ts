import express, { Response, Request, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import Customer from '../entity/Customer'
import AuthMiddleware from '../middlewares/AuthMiddleware'
import ValidateBodyMiddleware from '../middlewares/ValidateBodyMiddleware'
import CustomerSchema from '../schemas/CustomerSchema'

type RequestWithCustomer = Request & {
    customer: Customer
}

async function create(req: Request<any,any,Customer>, res: Response) {
    const customerRepo = getRepository(Customer)
    const newCustomer = customerRepo.create(req.body)
    const customer = await customerRepo.save(newCustomer)
    return res.status(200).json(customer)
}

async function update(req: RequestWithCustomer, res: Response) {
    const id = req.params.id

    const customerRepo = getRepository(Customer)

    const updatedUser = await customerRepo.save({
        id,
        ...req.customer
    })

    return res.status(200).json(updatedUser)
}

async function getAll(req: Request, res: Response) {
    const customerRepo = getRepository(Customer)
    const users = await customerRepo.find({
        relations: ['phones']
    })

    return res.status(200).json(users)
}

async function getByPk(req: RequestWithCustomer, res: Response) {
    return res.status(200).json(req.customer)
}

async function remove(req: RequestWithCustomer, res: Response) {
    const customerRepo = getRepository(Customer)

    await customerRepo.remove(req.customer)

    return res.status(200).send()
}

async function customerExistsMiddleware(req: RequestWithCustomer, res: Response, next: NextFunction) {
    const id = req.params.id
    const customerRepo = getRepository(Customer)

    const customer = await customerRepo.findOne(id)

    if(!customer) return res.status(400).send()

    req.customer = customer

    next()
}

const customerRoute = express.Router()

customerRoute.post('/', ValidateBodyMiddleware(CustomerSchema), create)
customerRoute.get('/', getAll)
customerRoute.use('/:id', customerExistsMiddleware)
customerRoute.get('/:id', getByPk)
customerRoute.delete('/:id', remove)
customerRoute.put('/:id', ValidateBodyMiddleware(CustomerSchema), update)

export default customerRoute