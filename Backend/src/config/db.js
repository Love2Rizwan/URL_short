const mongoose = require("mongoose");

const connectToDatabase = async ()=> {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

    console.log("mongoose connected successfully");

  } catch (error) {
    console.error("mongoose connection error:", error);
  }
}

module.exports = connectToDatabase;

