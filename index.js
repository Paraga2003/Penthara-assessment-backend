import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import leaveRouter from './routes/leave.js'
import connectToDatabase from './db/db.js';
import dashboardRouter from './routes/dashboard.js'

connectToDatabase();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}
));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/leave' , leaveRouter)
app.use('/api/dashboard' , dashboardRouter)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});