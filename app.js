import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employee.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend integration
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HRMS Lite API is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
