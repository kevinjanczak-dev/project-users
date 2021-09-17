import { NextFunction, Response, Request } from "express";
import { ObjectSchema } from "yup";

export default function ValidateBodyMiddleware(yupSchema: ObjectSchema<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await yupSchema.validate(req.body, {
                abortEarly: false
            })
            next()
        }
        catch(ex) {
            return res.status(400).send(ex.errors)
        }
    }
}