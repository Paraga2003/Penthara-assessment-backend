import { response } from "express";
import Department from "../models/Department.js";


const addDepartment = async (req, res) => {
  try {
    const { dep_name , description } = req.body;
    const newDepartment = new Department({
      dep_name,
      description,
    });
    await newDepartment.save();
    return res.status(201).json({ success: true, message: "Department added successfully", department: newDepartment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    
  }

}
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    
  }
}

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    
  }

}
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name , description } = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(id, { dep_name, description }, { new: true });
    return res.status(200).json({ success: true, message: "Department updated successfully", department: updatedDepartment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    
  }
}

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
    
  }
}
export {addDepartment , getDepartments , getDepartment , updateDepartment , deleteDepartment};