import 'dotenv/config';
import app from '../app.js';
import connectToMongo from '../database/db.js';

// Connect to MongoDB (only once, connection is cached)
if (!global.mongoConnected) {
  connectToMongo();
  global.mongoConnected = true;
}

// Export the Express app as a serverless function
export default app;
