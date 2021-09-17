import "reflect-metadata";
import express from 'express'
import cors from 'cors'
import {createConnection} from "typeorm";
import UserController from "./controllers/UserController";
import CustomerController from "./controllers/CustomerController";

async function bootstrap() {

    const connection = await createConnection()

    const app = express()

    app.use(express.json())
    app.use(cors())

    app.use('/users', UserController)
    app.use('/customers', CustomerController)

    app.listen(8090, () => {
        console.log('Servidor iniciado na porta 8090')
    })
}

bootstrap().then(() => {})
