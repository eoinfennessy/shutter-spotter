import * as dotenv from "dotenv";
import Mongoose from "mongoose";

export function connectMongo() {
  dotenv.config();

  if (process.env.MONGO_DB !== undefined) {
    Mongoose.connect(process.env.MONGO_DB);
  } else {
    console.log("Failed to connect to Mongo: Please set 'MONGO_DB' environment variable")
  }
  
  const db = Mongoose.connection;

  db.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  db.on("disconnected", () => {
    console.log("database disconnected");
  });

  db.once("open", function () {
    console.log(`database connected to ${db.name} on ${db.host}`);
  });
}
