import app from './app.js';
import connectToMongo from './database/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectToMongo();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
});
