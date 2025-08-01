const mongoose = require("mongoose");
const { payMethodTypes, bookingOrderStatus } = require("../utils/enums");

const bookSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle",
    },
    pickupLocation:{
        address:String,
        coordinates:[Number],
        date:Date
    },
    dropoffLocation:{
        address:String,
        coordinates:[Number],
        date:Date
    },
    contactInfo: {
      firstname: String,
      lastname: String,
      email: String,
      phonenumber: String,
      country: String,
      city: String,
      state: String,
      zipCode: String,
    },
    totalAmount: Number,
    paymentMethod: {
      type: String,
      enum: [...payMethodTypes],
      default: payMethodTypes[1],
    },
    paymentIntentId:String,
    status: {
      type: String,
      enum: [...bookingOrderStatus],
      default: bookingOrderStatus[0],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
