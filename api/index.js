import 'dotenv/config';
import app from '../app.js';
import connectToMongo from '../database/db.js';
import mongoose from 'mongoose';

// Connect to MongoDB (only once per serverless function instance)
// Vercel serverless functions may reuse instances, so we cache the connection
// Use global to persist connection across serverless function invocations
if (!global.mongoConnectionPromise) {
  global.mongoConnectionPromise = (async () => {
    try {
      // Check if already connected
      if (mongoose.connection.readyState === 1) {
        console.log('✅ Using existing MongoDB connection');
        return;
      }
      
      // Connect if not already connected
      if (mongoose.connection.readyState === 0) {
        await connectToMongo();
      }
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      // Don't throw - let server continue
    }
  })();
  
  // Start connection (don't await - let it connect in background)
  global.mongoConnectionPromise.catch(() => {
    // Connection failed, but server can still run
  });
}

// Export the Express app as a serverless function
export default app;
