import Attendance from '../models/Attendance.model.js';
import Employee from '../models/Employee.model.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

// Helper function to transform attendance data for frontend
const transformAttendance = (attendance) => {
  // Employee is always populated in our queries, so use employee.employeeId
  // Fallback to empty string if somehow not populated
  const employeeId = attendance.employee?.employeeId || '';
  
  return {
    id: attendance._id.toString(),
    employeeId: employeeId,
    date: attendance.date.toISOString().split('T')[0],
    status: attendance.status,
  };
};

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Public
export const getAllAttendance = asyncHandler(async (req, res) => {
  const { date } = req.query;
  
  let query = {};
  if (date) {
    // Parse date and set to start of day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    query.date = { $gte: startDate, $lte: endDate };
  }

  const attendanceRecords = await Attendance.find(query)
    .populate('employeeId', 'employeeId fullName department')
    .sort({ date: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: attendanceRecords.map(transformAttendance),
  });
});

// @desc    Get attendance by employee ID
// @route   GET /api/attendance/:employeeId
// @access  Public
export const getAttendanceByEmployeeId = asyncHandler(async (req, res) => {
  // First find the employee by employeeId
  const employee = await Employee.findOne({ employeeId: req.params.employeeId });
  
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }

  const attendanceRecords = await Attendance.find({ employeeId: employee._id })
    .populate('employeeId', 'employeeId fullName department')
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    data: attendanceRecords.map(transformAttendance),
  });
});

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Public
export const markAttendance = asyncHandler(async (req, res) => {
  const { employeeId, date, status } = req.body;

  // Validation
  if (!employeeId || !date || !status) {
    return res.status(400).json({
      success: false,
      message: 'Please provide employeeId, date, and status',
    });
  }

  if (!['Present', 'Absent'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be either Present or Absent',
    });
  }

  // Find employee by employeeId
  const employee = await Employee.findOne({ employeeId });
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }

  // Parse date and set to start of day
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  // Check if attendance already exists for this date
  const existingAttendance = await Attendance.findOne({
    employeeId: employee._id,
    date: attendanceDate,
  });

  let attendance;
  if (existingAttendance) {
    // Update existing attendance
    existingAttendance.status = status;
    await existingAttendance.save();
    attendance = existingAttendance;
  } else {
    // Create new attendance
    attendance = await Attendance.create({
      employeeId: employee._id,
      date: attendanceDate,
      status,
    });
  }

  // Populate employee data
  await attendance.populate('employeeId', 'employeeId fullName department');

  res.status(200).json({
    success: true,
    data: transformAttendance(attendance),
  });
});
