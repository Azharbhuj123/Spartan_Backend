const mongoose = require("mongoose");
 

const servicesSchema = new mongoose.Schema(
  {
      title: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("services", servicesSchema);
