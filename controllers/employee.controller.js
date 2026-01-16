import Employee from '../models/Employee.model.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

// Helper function to transform employee data for frontend
const transformEmployee = (employee) => {
  return {
    id: employee.employeeId,
    name: employee.fullName,
    email: employee.email,
    department: employee.department,
  };
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: employees.map(transformEmployee),
  });
});

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Public
export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ employeeId: req.params.id });
  
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }

  res.status(200).json({
    success: true,
    data: transformEmployee(employee),
  });
});

// @desc    Create new employee
// @route   POST /api/employees
// @access  Public
export const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, department } = req.body;

  // Validation
  if (!name || !email || !department) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and department',
    });
  }

  // Generate employeeId if not provided
  const count = await Employee.countDocuments();
  const employeeId = `EMP${String(count + 1).padStart(3, '0')}`;

  // Check if email already exists
  const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
  if (existingEmployee) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists',
    });
  }

  const employee = await Employee.create({
    employeeId,
    fullName: name,
    email: email.toLowerCase(),
    department,
  });

  res.status(201).json({
    success: true,
    data: transformEmployee(employee),
  });
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Public
export const updateEmployee = asyncHandler(async (req, res) => {
  const { name, email, department } = req.body;
  const employeeId = req.params.id;

  const employee = await Employee.findOne({ employeeId });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }

  // Check if email is being changed and if it already exists
  if (email && email.toLowerCase() !== employee.email) {
    const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }
  }

  // Update fields
  if (name) employee.fullName = name;
  if (email) employee.email = email.toLowerCase();
  if (department) employee.department = department;

  await employee.save();

  res.status(200).json({
    success: true,
    data: transformEmployee(employee),
  });
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Public
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ employeeId: req.params.id });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }

  await Employee.deleteOne({ employeeId: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Employee deleted successfully',
  });
});
