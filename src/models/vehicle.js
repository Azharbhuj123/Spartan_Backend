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
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
          required: true
        },
        coordinates: {
          type: [Number],
          required: true,
          index: '2dsphere'
        }
      },
      date: Date,
    },

    dropoffLocation: {
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
          required: true
        },
        coordinates: {
          type: [Number],
          required: true,
          index: '2dsphere'
        }
      },
      date: Date,

    },
    price:Number,
    rating: Number,
    reviewsCount: Number,
    feautures: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("vehicle", vehicleSchema);
