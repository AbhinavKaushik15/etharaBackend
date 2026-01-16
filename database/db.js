import mongoose from "mongoose";

const connectToMongo = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Already connected to MongoDB");
      return;
    }

    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb+srv://abhinavsharmaas20000_db_user:abhi8899149311@etharacluster.dboa6iy.mongodb.net/";

    if (!mongoURI) {
      console.warn(
        "⚠️  MONGO_URI not found in environment variables. Using default connection string.",
      );
    }

    // Connection options for better serverless compatibility
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(mongoURI, options);
    console.log("✅ Database is connected successfully.");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.log(
      "⚠️  Server will continue to run, but database operations will fail.",
    );
    console.log(
      "💡 Make sure MongoDB is running or update MONGO_URI in environment variables",
    );
    // Don't throw - let server continue running
  }
};

export default connectToMongo;
