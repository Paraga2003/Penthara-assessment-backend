import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';  
import { addEmployee , getEmployees , getEmployee , updateEmployee} from '../controllers/employeeController.js';

const router = express.Router();

router.get('/' , verifyUser , getEmployees );
router.post('/add', verifyUser ,addEmployee  )
router.get('/:id' , verifyUser , getEmployee)
router.put('/edit/:id' , verifyUser , updateEmployee)

export default router;