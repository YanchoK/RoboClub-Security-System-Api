import express, { Router } from 'express';
import entryController from '../controllers/entry_controller.js';
// import { isAdmin } from '../middlewares/isAdmin.js';
// import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router: Router = express.Router();
router.get('/', entryController.getAllEntries);
router.get('/:id', entryController.getEntryById);
router.post('/', entryController.createNewEntry)
router.put('/:id', entryController.updateEntry);
router.delete('/:id', entryController.deleteEntry);
export default router;