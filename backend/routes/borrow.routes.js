import { Router } from 'express';
import { listBorrow, createBorrowRequest, approveBorrow, denyBorrow, returnBorrow } from '../controllers/borrow.controllers.js';

const router = Router();

router.get('/', listBorrow);
router.post('/', createBorrowRequest);
router.post('/:id/approve', approveBorrow);
router.post('/:id/deny', denyBorrow);
router.post('/:id/return', returnBorrow);

export default router;


