import Employee from '../models/Employee.model.js';
import Attendance from '../models/Attendance.model.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Public
export const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  // Get all employees
  const employees = await Employee.find();
  const totalEmployees = employees.length;

  // Get today's attendance
  const todayAttendance = await Attendance.find({
    date: { $gte: today, $lte: endOfToday },
  });

  const presentToday = todayAttendance.filter((att) => att.status === 'Present').length;
  const absentToday = todayAttendance.filter((att) => att.status === 'Absent').length;

  // Get unique departments
  const departments = [...new Set(employees.map((emp) => emp.department))];
  const totalDepartments = departments.length;

  // Weekly attendance trend (last 5 days)
  const dates = [];
  for (let i = 4; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }

  const weeklyTrend = await Promise.all(
    dates.map(async (date) => {
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const dayAttendance = await Attendance.find({
        date: { $gte: date, $lte: endOfDay },
      });

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        present: dayAttendance.filter((att) => att.status === 'Present').length,
        date: date.toISOString().split('T')[0],
      };
    })
  );

  // Department distribution
  const departmentDistribution = departments.map((dept) => ({
    name: dept,
    value: employees.filter((emp) => emp.department === dept).length,
  }));

  res.status(200).json({
    success: true,
    data: {
      totalEmployees,
      presentToday,
      absentToday,
      totalDepartments,
      weeklyTrend,
      departmentDistribution,
      todayAttendanceStatus: [
        { name: 'Present', count: presentToday },
        { name: 'Absent', count: absentToday },
      ],
    },
  });
});
