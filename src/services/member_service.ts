import { Member } from "../interfaces/member_interface"
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client'
import errorResponces from "../middlewares/errorResponces"
const prisma = new PrismaClient();

const MemberService = {

    async getAllMembers(): Promise<Member[]> {
        try {
            return await prisma.member.findMany() as Member[]
        } catch (error) {
            console.error("Error in getAllMembersInRange:", error);
            throw new Error("Error while getting members");
        }
    },

    async getAllMembersInRange(page: number, limit: number) {
        try {
            const allMembersInRange = await prisma.member.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            if (allMembersInRange.length === 0) {
                const membersCount = await prisma.member.count()
                throw { status: 500, message: `Number of elements exieded! Elements count: ${membersCount}.` };
            }

            return allMembersInRange as Member[];
        } catch (error) {
            console.error("Error in getAllMembersInRange:", error);
            throw new Error("Error while getting members");
        }
    },

    async getMemberById(memberId: number) {
        try {
            const member = await prisma.member.findFirst({
                where: {
                    id: memberId
                }
            });

            return member as Member;
        } catch (error: any) {
            console.error("Error in getMemberById:", error);
            throw new Error("Error while getting member by ID");
        }
    },

    async getMemberByEmail(memberEmail: string) {
        try {
            const member = await prisma.member.findUnique({
                where: {
                    email: memberEmail
                }
            });

            return member as Member;
        } catch (error: any) {
            console.error("Error in getMemberByEmail:", error);
            throw new Error("Error while getting member by email");
        }
    },

    async createNewMember(newMember: Member) {
        // const { firstName, lastName,fullName, email, passwordHash, role } = newMember;

        try {
            let { passwordHash, ...memberWithoutPassword } = newMember;
            passwordHash = await bcrypt.hash(passwordHash, 10);


            const createdMember = await prisma.member.create({
                data: { ...memberWithoutPassword, passwordHash: passwordHash }
            })

            delete (createdMember as any).passwordHash;
            return createdMember;
        }
        catch (error: any) {
            console.error("Error in createNewMember:", error);
            throw new Error("Error while creating a new member");
        }
    },

    async updateMember(memberId: number, changedMember: Member) {
        try {
            const updatedMember = await prisma.member.update({
                where: {
                    id: memberId
                },
                data: {
                    ...changedMember
                },
            });

            return updatedMember;
        } catch (error: any) {
            console.error("Error in updateMember:", error);
            throw new Error(errorResponces.updateMemberError.message);
        }
    },

    async deleteMember(memberId: number) {
        try {
            await prisma.member.delete({
                where: {
                    id: memberId
                }
            })
        } catch (error: any) {
            console.error("Error in deleteMember:", error);
            throw new Error("Error while deleting member");
        }
    }
}

export default MemberService;