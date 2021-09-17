import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import CustomerPhone from "./CustomerPhone";

@Entity()
export default class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    name: string;

    @Column({
        unique: true
    })
    cpf: string
    
    @OneToMany(() => CustomerPhone, customerPhone => customerPhone.customer, {
        cascade: true
    })
    phones: CustomerPhone[]
}