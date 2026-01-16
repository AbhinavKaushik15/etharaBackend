import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller.js';

const router = express.Router();

router.route('/').get(getAllEmployees).post(createEmployee);
router.route('/:id').get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);

export default router;
