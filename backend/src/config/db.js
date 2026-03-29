import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("DB Connected"); // eslint-disable-line no-console
  } catch (error) {
    console.log(error.message); // eslint-disable-line no-console
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};
