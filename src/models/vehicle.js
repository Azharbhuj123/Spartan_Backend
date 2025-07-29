const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    gallery: [String],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    yearModel: {
      type: String,
      required: true,
    },

    pickupLocation: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
      date:Date,
    },

    dropoffLocation: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
      date:Date,

    },
    price:Number,
    rating: Number,
    reviewsCount: Number,
    feautures: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("vehicle", vehicleSchema);
