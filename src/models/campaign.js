const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,  // always come as a number from divided by 100
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    redemCode: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default:"Active"
    },
    redemBy: [String],
     
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
