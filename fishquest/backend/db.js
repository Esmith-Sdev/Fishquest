import mongoose from "mongoose";
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, {})
  .then(() => console.log("Mongo Connected"))
  .catch((err) => {
    console.error("Mongo Error", err.message);
    process.exit(1);
  });
export default mongoose;
