import Department from "../models/Department.js"
import Employee from "../models/Employee.js"
import Leave from "../models/Leave.js"

const getSummary = async (req , res) => {
  try {
    const totalEmployees = await Employee.countDocuments()
    const totalDepartments = await Department.countDocuments()
    
    const employeeAppliedForLeave = await Leave.distinct('employeeId')

    const leaveStatus = await Leave.aggregate([
      {$group:{
        _id: "$status",
        count: {$sum: 1}
      }}
    ])

    const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved: leaveStatus.find(item => item._id === "Approved")?.count || 0,
      rejected: leaveStatus.find(item => item._id === "Rejected")?.count || 0,
      pending: leaveStatus.find(item => item._id === "Pending")?.count || 0,

    }
    return res.status(200).json({
      success:true , 
      totalEmployees,
      totalDepartments,
      leaveSummary
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, message: error.message });

    
  }

}



const getEmployeeSummary = async (req, res) => {
  try {
    // req.user is set by verifyUser middleware
    const userId = req.user._id;
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const employeeId = employee._id;

    // ---- TOTAL leaves for this employee ----
    const totalLeavesApplied = await Leave.countDocuments({ employeeId });

    // ---- Status wise counts (for this employee) ----
    const statusAgg = await Leave.aggregate([
      { $match: { employeeId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const approved =
      statusAgg.find((item) => item._id === "Approved")?.count || 0;
    const rejected =
      statusAgg.find((item) => item._id === "Rejected")?.count || 0;
    const pending =
      statusAgg.find((item) => item._id === "Pending")?.count || 0;

    // ---- Monthly leave balance (auto reset every month) ----
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const approvedThisMonth = await Leave.countDocuments({
      employeeId,
      status: "Approved",
      appliedAt: { $gte: startOfMonth, $lt: startOfNextMonth }, // or use startDate
    });
    const rejectedThisMonth = await Leave.countDocuments({
      employeeId,
      status: "Rejected",
      appliedAt: { $gte: startOfMonth, $lt: startOfNextMonth }, // or use startDate
    });
    const pendingThisMonth = await Leave.countDocuments({
      employeeId,
      status: "Pending",
      appliedAt: { $gte: startOfMonth, $lt: startOfNextMonth }, // or use startDate
    });

    const MONTHLY_ALLOWANCE = 10;
    const leaveBalance = Math.max(MONTHLY_ALLOWANCE - approvedThisMonth, 0);

    const leaveSummary = {
      totalLeavesApplied,
      leaveBalance,
      
      rejectedThisMonth,
      pendingThisMonth,
      approvedThisMonth,
    };

    return res.status(200).json({
      success: true,
      leaveSummary,
    });
  } catch (error) {
    console.log("Error in getEmployeeSummary:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};



export {getSummary , getEmployeeSummary}