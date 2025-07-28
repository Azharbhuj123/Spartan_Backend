const Vehicle = require("../models/vehicle");
const { paginateData } = require("../utils/helper");
const {
  vehicleSchema,
  updateVehicleSchema,
} = require("../utils/validationSchema");

// Create a new vehicle
exports.addVehicle = async (req, res) => {
  try {
    const { error } = vehicleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const vehicle = new Vehicle(req.body);
    await vehicle.save();

    res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    pickupLocation,
    dropoffLocation,
    pickupDate,
    dropoffDate,
  } = req.query;
  try {
    let query = {};

    if (pickupLocation) {
      query.pickupLocation.address = { $regex: pickupLocation, $options: "i" };
    }
    if (dropoffLocation) {
      query.dropoffLocation.address = {
        $regex: dropoffLocation,
        $options: "i",
      };
    }
    if (pickupDate) {
      query.pickupLocation.date = { $gte: new Date(pickupDate) };
    }
    if (dropoffDate) {
      query.dropoffLocation.date = { $lte: new Date(dropoffDate) };
    }

    const vehicles = await paginateData(
      Vehicle,
      page,
      limit,
      query,
      "-updatedAt -__v"
    );

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update vehicle by ID
exports.updateVehicle = async (req, res) => {
  try {
    const { error } = updateVehicleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete vehicle by ID
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
