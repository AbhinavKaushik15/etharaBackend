import express from 'express';
import {
  getAllAttendance,
  getAttendanceByEmployeeId,
  markAttendance,
} from '../controllers/attendance.controller.js';

const router = express.Router();

router.route('/').get(getAllAttendance).post(markAttendance);
router.route('/:employeeId').get(getAttendanceByEmployeeId);

export default router;
