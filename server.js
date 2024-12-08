import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo URI:", process.env.MONGO_URI);

    console.log("Successfully connected to MongoDB Atlas");
    app.listen(PORT, function () {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
start();
