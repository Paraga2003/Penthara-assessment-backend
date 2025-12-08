import express from 'express'
import verifyUser from '../middleware/authMiddleware.js'
import { getSummary , getEmployeeSummary } from '../controllers/dashboardController.js';

const router = express.Router()

router.get('/summary' , verifyUser ,getSummary )
router.get('/employee/summary' , verifyUser , getEmployeeSummary)

export default router ; 