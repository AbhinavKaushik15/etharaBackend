import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employee.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middleware
// CORS configuration - allow both localhost and Vercel deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // Allow all origins in production for now (you can restrict this)
      callback(null, true);
    }
  },
  credentials: true,
}));
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
