import { Request, Response, NextFunction } from 'express';
import { Member } from "../interfaces/member_interface"
import memberService from '../services/member_service'
import errorResponces from "../middlewares/errorResponces"
import validator from '../middlewares/validator';
import bcrypt from "bcrypt";

const MemberController = {

    async getAllMembers(req: Request, res: Response) {
        const page: number = parseInt(req.query.page as string) || 1; // The requested page number
        const limit: number = parseInt(req.query.limit as string) || 5; // Number of items per page

        try {
            let allMembers: Member[];
            if (!req.query.page && !req.query.limit) {
                allMembers = await memberService.getAllMembers();
            }
            else {
                allMembers = await memberService.getAllMembersInRange(page, limit);
            }
            res.status(200).send({ count: allMembers.length, members: allMembers });
        } catch (error) {
            console.error("Error in getAllMembers:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async getMemberById(req: Request, res: Response) {
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

        try {
            const member = await memberService.getMemberById(parseInt(id))

            if (!member) {
                return res.status(404).json(errorResponces.memberNotFound);
            }

            res.status(200).json(member);
        } catch (error) {
            console.error("Error in getMemberById:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async createNewMember(req: Request, res: Response) {
        let { error, value } = validator.validateMember(req.body)
        const { firstName, lastName, email, password, role } = value;

        if (error) {
            // res.status(400).json(errorResponces.invalidMemberData);
            console.log(error);
            return res.status(400).send({ message: `${errorResponces.invalidMemberData.message}. ${error.message}` });
        }
        else if (await memberService.getMemberByEmail(email)) {
            return res.status(409).json(errorResponces.memberAlreadyExists);
        }
        else {
            try {
                const newMember: Member = {
                    firstName: firstName,
                    lastName: lastName,
                    fullName: firstName + " " + lastName,
                    email: email,
                    passwordHash: password,
                    role: role,
                }

                const createdMember = await memberService.createNewMember(newMember)

                // TODO! Login
                // req.login(createdMember, (err) => {
                //     if (err) {
                //         console.error("Error during automatic login:", err);
                //         return res.status(500).json(errorResponces.internalServerError);
                //     }
                //     // Return a success response
                //     res.status(201).json({ message: "Member is created and logged in", data: createdMember });
                // });
                res.status(201).json({ message: "Member is created", data: createdMember });
            }
            catch (error: any) {
                console.error("Error in createNewMember:", error);
                res.status(500).json(errorResponces.internalServerError);
            }
        }
    },

    async updateMember(req: Request, res: Response) {
        let validation = validator.validateUpdateMember(req.body)
        let changedMember = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: `${errorResponces.invalidMemberData.message}. ${validation.error.message}` });
        }

        validation = validator.validateId(req.params)
        let { id } = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: validation.error.message });
        }

        try {
            const member = await memberService.getMemberById(id)

            if (!member) {
                return res.status(404).json(errorResponces.memberNotFound);
            }

            if (changedMember.password) {
                changedMember.passwordHash = await bcrypt.hash(changedMember.password, 10);
                delete changedMember.password
            }

            const fullName = `${changedMember.firstName ? changedMember.firstName : member.firstName} ${changedMember.lastName ? changedMember.lastName : member.lastName}`
            changedMember.fullName = fullName

            const updatedMember = await memberService.updateMember(id, changedMember)
            res.status(200).json({ message: "Member is updated", data: updatedMember });
        } catch (error: any) {
            console.error("Error in updateMember:", error);
            res.status(500).json(error.message ? error.message : errorResponces.internalServerError);
        }
    },

    async deleteMember(req: Request, res: Response) {
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

        try {
            const member = await memberService.getMemberById(id)

            if (!member) {
                return res.status(404).json(errorResponces.memberNotFound);
            }

            await memberService.deleteMember(id)
            res.status(200).json({ message: "Member is deleted" });
        } catch (error: any) {
            console.error("Error in deleteMember:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },
}

export default MemberController;