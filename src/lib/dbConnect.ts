import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing database connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connection.readyState;
    console.log("Database connected succesfully!!");
  } catch (error) {
    console.log("Error connecting to the database:", error);
    process.exit();
  }
}
