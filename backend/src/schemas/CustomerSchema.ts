import { timeStamp } from 'console';
import { getRepository } from 'typeorm'
import * as yup from 'yup'
import Customer from '../entity/Customer'
import CustomerPhone from '../entity/CustomerPhone';

const customerPhoneSchema = yup.object().shape({
    id: yup.number(),
    default: yup.bool(),
    phone: yup.string().required().min(10).test({
        async test(value, ctx) {
            const { id } = ctx.parent

            const customerPhoneRepo = getRepository(CustomerPhone)

            const customerPhone = await customerPhoneRepo.findOne({
                phone: value
            })

            return !(customerPhone && customerPhone.id != id)
        },
        message: 'phone (${value}) already taken'
    })
})

function isValidCPF(number: string) {
    var sum;
    var rest;
    sum = 0;
    if (number == "00000000000") return false;

    for (let i=1; i<=9; i++) sum = sum + parseInt(number.substring(i-1, i)) * (11 - i);
    rest = (sum * 10) % 11;

    if ((rest == 10) || (rest == 11))  rest = 0;
    if (rest != parseInt(number.substring(9, 10)) ) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(number.substring(i-1, i)) * (12 - i);
    rest = (sum * 10) % 11;

    if ((rest == 10) || (rest == 11))  rest = 0;
    if (rest != parseInt(number.substring(10, 11) ) ) return false;
    return true;
}

const customerSchema = yup.object().shape({
    id: yup.number(),
    name: yup.string().required(),
    email: yup.string().email().test({
        async test(value, ctx) {
            const { id } = ctx.parent

            const customerRepo = getRepository(Customer)

            const customer = await customerRepo.findOne({
                email: value
            })

            return !(customer && customer.id != id)
        },
        message: 'email already taken'
    }),
    cpf: yup.string().required().length(11)
        .test({
            async test(value, ctx) {
                return isValidCPF(value)
            },
            message: 'incorrect cpf'
        })
        .test({
            async test(value, ctx) {
                const { id } = ctx.parent

                const customerRepo = getRepository(Customer)

                const customer = await customerRepo.findOne({
                    cpf: value
                })

                return !(customer && customer.id != id)
            },
            message: 'cpf already taken'
        }),
    phones: yup.array(customerPhoneSchema).required().min(1)
})

export default customerSchema