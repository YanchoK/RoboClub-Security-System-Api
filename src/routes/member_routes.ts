import express, { Router } from 'express';
import memberController from '../controllers/member_controller.js';
// import { isAdmin } from '../middlewares/isAdmin.js';
// import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router: Router = express.Router();
router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMemberById);
router.post('/', memberController.createNewMember)
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);
export default router;

// const router: Router = express.Router();
// router.get('/', isAuthenticated, memberController.getAllUsers);
// router.get('/:id', isAuthenticated, memberController.getUserById);
// router.post('/', isAuthenticated, memberController.createNewUser)
// router.put('/:id', isAuthenticated, memberController.updateUser);
// router.delete('/:id', isAuthenticated, isAdmin, memberController.deleteUser);
// export default router;

