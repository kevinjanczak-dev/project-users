import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from "typeorm";
import bcrypt from 'bcrypt'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    name: string;

    @Column({
        select: false,
    })
    password: string

    @Column({
        type: 'json'
    })
    permissions: string[]

    @BeforeInsert()
    encryptPassword(): void {
        const passwordHash = bcrypt.hashSync(this.password, 10)
        this.password = passwordHash
    }

}
