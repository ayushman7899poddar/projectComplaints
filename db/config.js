
const mongoose = require("mongoose");

const connectDb = async () => {

  try {

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/usercomplaints`
    );

    console.log(
      `connection unsuccessful`
    );
  } catch (error) {
    console.error("MongoDb connection FAILED", error);
    process.exit(1);
  }
};

module.exports = connectDb;
