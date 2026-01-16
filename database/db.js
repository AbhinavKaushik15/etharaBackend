import { connect } from "mongoose";

const connectToMongo = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("*** Database is connected successfully. ***");
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;
