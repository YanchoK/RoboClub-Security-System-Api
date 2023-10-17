import { Entry } from "../interfaces/entry_interface"
import { PrismaClient } from '@prisma/client'
import errorResponces from "../middlewares/errorResponces"
const prisma = new PrismaClient();

const EntryService = {

    async getAllEntries(): Promise<Entry[]> {
        try {
            return await prisma.entry.findMany() as Entry[]
        } catch (error) {
            console.error("Error in getAllEntriesInRange:", error);
            throw new Error("Error while getting entries");
        }
    },

    async getAllEntriesInRange(page: number, limit: number) {
        try {
            const allEntriesInRange = await prisma.entry.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            if (allEntriesInRange.length === 0) {
                const entriesCount = await prisma.entry.count()
                throw { status: 500, message: `Number of elements exieded! Elements count: ${entriesCount}.` };
            }

            return allEntriesInRange as Entry[];
        } catch (error) {
            console.error("Error in getAllEntriesInRange:", error);
            throw new Error("Error while getting entries");
        }
    },

    async getEntryById(entryId: number) {
        try {
            const entry = await prisma.entry.findFirst({
                where: {
                    id: entryId
                }
            });

            return entry as Entry;
        } catch (error: any) {
            console.error("Error in getEntryById:", error);
            throw new Error("Error while getting entry by ID");
        }
    },

    async createNewEntry(newEntry: Entry) {
        try {
           
            const createdEntry = await prisma.entry.create({
                data: newEntry
            })

            delete (createdEntry as any).passwordHash;
            return createdEntry;
        }
        catch (error: any) {
            console.error("Error in createNewEntry:", error);
            throw new Error("Error while creating a new entry");
        }
    },

    async updateEntry(entryId: number, changedEntry: Entry) {
        try {
            const updatedEntry = await prisma.entry.update({
                where: {
                    id: entryId
                },
                data: {
                    ...changedEntry
                },
            });

            return updatedEntry;
        } catch (error: any) {
            console.error("Error in updateEntry:", error);
            throw new Error(errorResponces.updateEntryError.message);
        }
    },

    async deleteEntry(entryId: number) {
        try {
            await prisma.entry.delete({
                where: {
                    id: entryId
                }
            })
        } catch (error: any) {
            console.error("Error in deleteEntry:", error);
            throw new Error("Error while deleting entry");
        }
    }
}

export default EntryService;