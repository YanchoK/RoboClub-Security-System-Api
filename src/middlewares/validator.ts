import Joi, { Schema, number } from "joi"
import { MemberRole } from '../interfaces/member_interface'
// import { TicketPriority, TicketState } from "../interfaces/ticket_interface";

type Payload = Record<string, any>;

const validator = (schema: Schema) => (payload: Payload) =>
    schema.validate(payload, { abortEarly: false });

const schemas = {
    logInSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
        // confirmPassword: Joi.ref("password"),
    }),
    idSchema: Joi.object({
        id: Joi.number().required()
    }),
    memberSchema: Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().min(6).max(30).required(),
        role: Joi.string().valid(...Object.values(MemberRole)).required(),
        cardId: Joi.number().optional()
    }),
    updateMemberSchema: Joi.object({
        email: Joi.string().email().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        password: Joi.string().min(6).max(30).optional(),
        profileImageName: Joi.string().optional(),
        role: Joi.string().valid(...Object.values(MemberRole)).optional(),
        cardId: Joi.number().optional()
    }),
    cardSchema: Joi.object({
        cardValue:Joi.string().required(),
        isActive:Joi.boolean().required()
    }),
    updateCardSchema: Joi.object({
        cardValue:Joi.string().optional(),
        isActive:Joi.boolean().optional(),
    }),
}

const validations = {
    validateLogIn: validator(schemas.logInSchema),

    validateId: validator(schemas.idSchema),

    validateMember: validator(schemas.memberSchema),
    validateUpdateMember: validator(schemas.updateMemberSchema),

    validateCard:validator(schemas.cardSchema),
    validateUpdateCard:validator(schemas.updateCardSchema),


}

export default validations
