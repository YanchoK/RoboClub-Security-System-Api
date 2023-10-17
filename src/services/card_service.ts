import { Card } from "../interfaces/card_interface"
import { PrismaClient } from '@prisma/client'
import errorResponces from "../middlewares/errorResponces"
const prisma = new PrismaClient();

const CardService = {

    async getAllCards(): Promise<Card[]> {
        try {
            return await prisma.card.findMany() as Card[]
        } catch (error) {
            console.error("Error in getAllCardsInRange:", error);
            throw new Error("Error while getting cards");
        }
    },

    async getAllCardsInRange(page: number, limit: number) {
        try {
            const allCardsInRange = await prisma.card.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            if (allCardsInRange.length === 0) {
                const cardsCount = await prisma.card.count()
                throw { status: 500, message: `Number of elements exieded! Elements count: ${cardsCount}.` };
            }

            return allCardsInRange as Card[];
        } catch (error) {
            console.error("Error in getAllCardsInRange:", error);
            throw new Error("Error while getting cards");
        }
    },

    async getCardById(cardId: number) {
        try {
            const card = await prisma.card.findFirst({
                where: {
                    id: cardId
                }
            });

            return card as Card;
        } catch (error: any) {
            console.error("Error in getCardById:", error);
            throw new Error("Error while getting card by ID");
        }
    },

    async getCardByValue(cardValue: string) {
        try {
            const card = await prisma.card.findUnique({
                where: {
                    cardValue: cardValue
                }
            });

            return card as Card;
        } catch (error: any) {
            console.error("Error in getCardByValue:", error);
            throw new Error("Error while getting card by value");
        }
    },

    async createNewCard(newCard: Card) {
        try {
           
            const createdCard = await prisma.card.create({
                data: newCard
            })

            delete (createdCard as any).passwordHash;
            return createdCard;
        }
        catch (error: any) {
            console.error("Error in createNewCard:", error);
            throw new Error("Error while creating a new card");
        }
    },

    async updateCard(cardId: number, changedCard: Card) {
        try {
            const updatedCard = await prisma.card.update({
                where: {
                    id: cardId
                },
                data: {
                    ...changedCard
                },
            });

            return updatedCard;
        } catch (error: any) {
            console.error("Error in updateCard:", error);
            throw new Error(errorResponces.updateCardError.message);
        }
    },

    async deleteCard(cardId: number) {
        try {
            await prisma.card.delete({
                where: {
                    id: cardId
                }
            })
        } catch (error: any) {
            console.error("Error in deleteCard:", error);
            throw new Error("Error while deleting card");
        }
    }
}

export default CardService;