import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Customer from "./Customer";

@Entity()
export default class CustomerPhone {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: false
    })
    default: boolean

    @Column({
        unique: true
    })
    phone: string

    @ManyToOne(() => Customer, customer => customer.phones)
    customer: Customer
}