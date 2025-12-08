import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';  
import { addLeave , getLeaves , getAdminLeaves ,getLeaveDetail, updateStatus} from '../controllers/leaveController.js';


const router = express.Router();

router.post('/add' , verifyUser , addLeave )

router.get('/detail/:id' , verifyUser , getLeaveDetail)
router.get('/:id' , verifyUser , getLeaves)

router.get('/' , verifyUser , getAdminLeaves)

router.put('/:id' , verifyUser , updateStatus)


export default router;