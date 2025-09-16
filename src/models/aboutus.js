const mongoose = require("mongoose");
 

const aboutusSchema = new mongoose.Schema(
  {
    description: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("aboutus", aboutusSchema);
