const mongoose = require("mongoose");
 

const testimonialsSchema = new mongoose.Schema(
  {
    image: String,
    name: String,
    designation: String,
    title: String,
    description: String,
    rating: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("testimonials", testimonialsSchema);
