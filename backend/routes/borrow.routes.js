import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { 
    listBorrow, 
    createBorrowRequest, 
    approveBorrow, 
    denyBorrow, 
    returnBorrow,
    markOverdueItems,
    payPenalty,
    getStudentHistory
} from '../controllers/borrow.controllers.js';

const router = Router();

// All borrow routes require authentication
router.use(verifyJwt);

router.get('/', listBorrow);
router.get('/student/:studentId/history', getStudentHistory);
router.post('/', createBorrowRequest);
router.post('/:id/approve', approveBorrow);
router.post('/:id/deny', denyBorrow);
router.post('/:id/return', returnBorrow);
router.post('/:id/pay-penalty', payPenalty);
router.post('/admin/mark-overdue', markOverdueItems);

export default router;


