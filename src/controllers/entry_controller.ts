import { Request, Response, NextFunction } from 'express';
import { Entry } from "../interfaces/entry_interface"
import entryService from '../services/entry_service'
import errorResponces from "../middlewares/errorResponces"
import validator from '../middlewares/validator';

const EntryController = {

    async getAllEntries(req: Request, res: Response) {
        const page: number = parseInt(req.query.page as string) || 1; // The requested page number
        const limit: number = parseInt(req.query.limit as string) || 5; // Number of items per page

        try {
            let allEntries: Entry[];
            if (!req.query.page && !req.query.limit) {
                allEntries = await entryService.getAllEntries();
            }
            else {
                allEntries = await entryService.getAllEntriesInRange(page, limit);
            }
            res.status(200).send({ count: allEntries.length, entries: allEntries });
        } catch (error) {
            console.error("Error in getAllEntries:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async getEntryById(req: Request, res: Response) {
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

        try {
            const entry = await entryService.getEntryById(parseInt(id))

            if (!entry) {
                return res.status(404).json(errorResponces.entryNotFound);
            }

            res.status(200).json(entry);
        } catch (error) {
            console.error("Error in getEntryById:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async createNewEntry(req: Request, res: Response) {
        let { error, value } = validator.validateEntry(req.body)

        if (error) {
            // res.status(400).json(errorResponces.invalidEntryData);
            console.log(error);
            return res.status(400).send({ message: `${errorResponces.invalidEntryData.message}. ${error.message}` });
        }
        else {
            try {
                const createdEntry = await entryService.createNewEntry(value as Entry)
                res.status(201).json({ message: "Entry is created", data: createdEntry });
            }
            catch (error: any) {
                console.error("Error in createNewEntry:", error);
                res.status(500).json(errorResponces.internalServerError);
            }
        }
    },

    async updateEntry(req: Request, res: Response) {
        let validation = validator.validateUpdateEntry(req.body)
        let changedEntry = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: `${errorResponces.invalidEntryData.message}. ${validation.error.message}` });
        }

        validation = validator.validateId(req.params)
        let {id} = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: validation.error.message });
        }

        try {
            const entry = await entryService.getEntryById(id)

            if (!entry) {
                return res.status(404).json(errorResponces.entryNotFound);
            }

            const updatedEntry = await entryService.updateEntry(id, changedEntry)
            res.status(200).json({ message: "Entry is updated", data: updatedEntry });
        } catch (error: any) {
            console.error("Error in updateEntry:", error);
            res.status(500).json(error.message ? error.message : errorResponces.internalServerError);
        }
    },

    async deleteEntry(req: Request, res: Response) {
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

        try {
            const entry = await entryService.getEntryById(id)

            if (!entry) {
                return res.status(404).json(errorResponces.entryNotFound);
            }

            await entryService.deleteEntry(id)
            res.status(200).json({ message: "Entry is deleted" });
        } catch (error: any) {
            console.error("Error in deleteEntry:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },
}

export default EntryController;