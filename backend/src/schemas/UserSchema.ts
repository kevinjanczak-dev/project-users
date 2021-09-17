import { getRepository } from 'typeorm'
import * as yup from 'yup'
import { User } from '../entity/User'

const userSchema = yup.object().shape({
    id: yup.number().notRequired(),
    name: yup.string().required(),
    email: yup.string().required().email().test({
        async test(value, ctx) {
            const { id } = ctx.parent

            const userRepo = getRepository(User)

            const user = await userRepo.findOne({
                email: value
            })

            return !(user && user.id != id)
        },
        message: 'email already taken'
    }),
    password: yup.string().when('id', function(id, schema) {
        if(!id) {
            return schema
                .min(6)
                .required()
                .test({
                    test(value, ctx) {
                        const { passwordConfirmation } = ctx.parent

                        return passwordConfirmation === value
                    },
                    message: 'password and passwordConfirmation is not equals'
                })
        }
        return schema
    }),
    passwordConfirmation: yup.string(),
    permissions: yup.array(yup.string()).required().min(1)
})

export default userSchema