import Employee from '../models/Employee.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import Department from '../models/Department.js';
const addEmployee = async (req,res) =>{
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      designation,
      department, 
      doj,
      password,
      role,
  
    } = req.body;
    const user = await User.findOne({email});
    if(user){
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }
    const hashPassword = await bcrypt.hash(password,10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
    });
    const savedUser = await newUser.save();
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,  
      gender,
      designation,
      department,
      doj,
    });
     await newEmployee.save();
    return res.status(201).json({ success: true, message: "Employee added successfully", employee: newEmployee });
    
  } catch (error) {
    console.log("Error in adding employee:", error);
    return res.status(500).json({ success: false, message: error.message });
    
  }
  



}

const getEmployees = async (req,res) =>{
  try {
    const employees = await Employee.find().populate('userId' , {password:0}).populate('department');
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    
  }
}
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate('userId',{password:0}).populate("department");

    return res.status(200).json({ success: true, employee });
    
  } catch (error) {
  
    return res.status(500).json({ success: false, message: error.message });
    
  }

}

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, department } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Update user name
    await User.findByIdAndUpdate(employee.userId, { name });

    // Update employee fields
    await Employee.findByIdAndUpdate(id, { designation, department });

    return res.status(200).json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.log("Update Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export {addEmployee , getEmployees , getEmployee , updateEmployee};