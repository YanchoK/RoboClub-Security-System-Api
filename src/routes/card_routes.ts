import express, { Router } from 'express';
import cardController from '../controllers/card_controller.js';
// import { isAdmin } from '../middlewares/isAdmin.js';
// import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router: Router = express.Router();
router.get('/', cardController.getAllCards);
router.get('/:id', cardController.getCardById);
router.post('/', cardController.createNewCard)
router.put('/:id', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);
export default router;