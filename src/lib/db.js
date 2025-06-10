import mongoose from "mongoose";

export const connectionDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected : ", connect.connection.host);
  } catch (error) {
    console.log("MongoDB connextion error", error);
  }
};
