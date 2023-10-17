import { Request, Response, NextFunction } from 'express';
import { Card } from "../interfaces/card_interface"
import cardService from '../services/card_service'
import errorResponces from "../middlewares/errorResponces"
import validator from '../middlewares/validator';

const CardController = {

    async getAllCards(req: Request, res: Response) {
        const page: number = parseInt(req.query.page as string) || 1; // The requested page number
        const limit: number = parseInt(req.query.limit as string) || 5; // Number of items per page

        try {
            let allCards: Card[];
            if (!req.query.page && !req.query.limit) {
                allCards = await cardService.getAllCards();
            }
            else {
                allCards = await cardService.getAllCardsInRange(page, limit);
            }
            res.status(200).send({ count: allCards.length, cards: allCards });
        } catch (error) {
            console.error("Error in getAllCards:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async getCardById(req: Request, res: Response) {
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

        try {
            const card = await cardService.getCardById(parseInt(id))

            if (!card) {
                return res.status(404).json(errorResponces.cardNotFound);
            }

            res.status(200).json(card);
        } catch (error) {
            console.error("Error in getCardById:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },

    async createNewCard(req: Request, res: Response) {
        let { error, value } = validator.validateCard(req.body)
        const { cardValue, isActive } = value;

        if (error) {
            // res.status(400).json(errorResponces.invalidCardData);
            console.log(error);
            return res.status(400).send({ message: `${errorResponces.invalidCardData.message}. ${error.message}` });
        }
        else if (await cardService.getCardByValue(cardValue)) {
            return res.status(409).json(errorResponces.cardAlreadyExists);
        }
        else {
            try {
                const createdCard = await cardService.createNewCard(value as Card)
                res.status(201).json({ message: "Card is created", data: createdCard });
            }
            catch (error: any) {
                console.error("Error in createNewCard:", error);
                res.status(500).json(errorResponces.internalServerError);
            }
        }
    },

    async updateCard(req: Request, res: Response) {
        let validation = validator.validateUpdateCard(req.body)
        let changedCard = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: `${errorResponces.invalidCardData.message}. ${validation.error.message}` });
        }

        validation = validator.validateId(req.params)
        let {id} = validation.value

        if (validation.error) {
            console.log(validation.error);
            return res.status(400).send({ message: validation.error.message });
        }

        try {
            const card = await cardService.getCardById(id)

            if (!card) {
                return res.status(404).json(errorResponces.cardNotFound);
            }

            const updatedCard = await cardService.updateCard(id, changedCard)
            res.status(200).json({ message: "Card is updated", data: updatedCard });
        } catch (error: any) {
            console.error("Error in updateCard:", error);
            res.status(500).json(error.message ? error.message : errorResponces.internalServerError);
        }
    },

    async deleteCard(req: Request, res: Response) {
        let { error, value } = validator.validateId(req.params);
        const { id } = value;

        if (error) {
            console.log(error);
            return res.status(400).send({ message: error.message });
        }

        try {
            const card = await cardService.getCardById(id)

            if (!card) {
                return res.status(404).json(errorResponces.cardNotFound);
            }

            await cardService.deleteCard(id)
            res.status(200).json({ message: "Card is deleted" });
        } catch (error: any) {
            console.error("Error in deleteCard:", error);
            res.status(500).json(errorResponces.internalServerError);
        }
    },
}

export default CardController;