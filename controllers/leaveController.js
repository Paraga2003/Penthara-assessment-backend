import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const addLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    const userId = req.user._id; 

    const employee = await Employee.findOne({ userId });

    const newLeave = new Leave({
      employeeId: employee._id,
      startDate,
      endDate,
      reason
    });

    await newLeave.save();

    return res.status(201).json({ success: true });

  } catch (error) {
    console.log("Error in adding leave:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getLeaves = async (req, res) => {
  try {
    const userId = req.user._id;
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const leaves = await Leave.find({
      employeeId: employee._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leaves,
    });

  } catch (error) {
    console.log("Error in getting leave:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAdminLeaves = async (req , res)=>{
  try{
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate:[
        {
          path:'department',
          select: 'dep_name'
        },
        {
          path: 'userId',
          select: 'name'
        }
      ]
    })
    return res.status(200).json({success:true , leaves})

  }catch (error) {
      console.log("Error in getting leave:", error);
      return res.status(500).json({ success: false, message: error.message });
      
    }


}
const getLeaveDetail = async (req , res)=>{

    try {
      const { id } = req.params
      const leave = await Leave.findById(id).populate({
        path: "employeeId",
        populate: [
          { path: "department", select: "dep_name" },
          { path: "userId", select: "name" }
        ]
      });
  
      return res.status(200).json({ success: true, leave });
    } catch (error) {
      console.log("Error in getting leave:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  
  }
  const updateStatus = async (req , res)=>{
    try{
      const {id} = req.params
      const leave = await Leave.findByIdAndUpdate({_id : id} , {status: req.body.status})
      if(!leave){
        return res.status(400).json({ success: false, error:"leave not founded" });
      }
      return res.status(200).json({success:true})

    }catch (error) {
      console.log("Error in getting leave:", error);
      return res.status(500).json({ success: false, message: error.message });
    }

  }

export { addLeave, getLeaves, getAdminLeaves , getLeaveDetail , updateStatus};
