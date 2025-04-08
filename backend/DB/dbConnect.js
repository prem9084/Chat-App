import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    console.log(`DB connected Succesfully ${db.connection.host}`);
  } catch (error) {
    console.log(console.error);
  }
};

export default dbConnect;
