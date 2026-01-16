import { connect } from "mongoose";

const connectToMongo = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb+srv://abhinavsharmaas20000_db_user:abhi8899149311@etharacluster.dboa6iy.mongodb.net/";

    if (!mongoURI) {
      console.warn(
        "⚠️  MONGO_URI not found in environment variables. Using default: mongodb+srv://abhinavsharmaas20000_db_user:abhi8899149311@etharacluster.dboa6iy.mongodb.net/",
      );
    }

    await connect(mongoURI);
    console.log("✅ Database is connected successfully.");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.log(
      "⚠️  Server will continue to run, but database operations will fail.",
    );
    console.log(
      "💡 Make sure MongoDB is running or update MONGO_URI in .env file",
    );
  }
};

export default connectToMongo;
