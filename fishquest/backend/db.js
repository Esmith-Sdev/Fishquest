const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, {})
  .then(() => console.log("Mongo Connected"))
  .catch((err) => {
    console.error("Mongo Error", err);
    process.exit(1);
  });
module.exports = mongoose;
