const mongoose = require("mongoose");
const logger = require("./utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB successfully...");
  } catch (err) {
    logger.error("Could not connect to MongoDB", err);
    process.exit(1); // Stop the app if the database fails
  }
};

module.exports = {connectDB};