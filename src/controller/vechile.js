const Vehicle = require("../models/vehicle");
const { paginateData } = require("../utils/helper");
const {
  vehicleSchema,
  updateVehicleSchema,
} = require("../utils/validationSchema");
const cache = require("../utils/cache");
const { v4: uuidv4 } = require("uuid");

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

exports.storeSearch = async (req, res) => {
    const data = req.body;
    const token = uuidv4(); 
    cache.set(token, data); 

    res.json({ token }); 
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    searchQuery={},
  } = req.query;
  try {
    let parseQuery = {};

    if (typeof searchQuery === "string" && searchQuery.trim() !== "") {
      try {
        parseQuery = JSON.parse(searchQuery);
      } catch (err) {
        console.warn("Invalid JSON in searchQuery:", searchQuery);
        parseQuery = {};
      }
    } else if (typeof searchQuery === "object" && searchQuery !== null) {
      parseQuery = searchQuery;
    }
    
  
    const query = {};
    console.log(parseQuery);
    
    // Handle geospatial search using $geoWithin with $centerSphere for better pagination compatibility
    if (parseQuery?.pickupLocation?.coordinates) {
      const { lat, lng } = parseQuery.pickupLocation.coordinates;
      // Convert 10km to radians (Earth's radius is approximately 6371km)
      const radiusInKm = 10;
      const radiusInRadians = radiusInKm / 6371;
      
      query["pickupLocation.coordinates"] = {
        $geoWithin: {
          $centerSphere: [
            [lng, lat], // [longitude, latitude] order
            radiusInRadians
          ]
        }
      };
    }
    if (parseQuery?.pickupDate && parseQuery?.dropoffDate) {
      query["pickupLocation.date"] = { $lte: new Date(parseQuery?.pickupDate) };
      query["dropoffLocation.date"] = { $gte: new Date(parseQuery?.dropoffDate) };
    }
    
    

    // First, get all vehicles matching the pickup location and date criteria
    let vehicles = await paginateData(
      Vehicle,
      page,
      limit,
      query,
      "-updatedAt -__v"
    );

    // If we have dropoff location coordinates, filter in memory
    if (parseQuery?.dropoffLocation?.coordinates) {
      const { lat: dropoffLat, lng: dropoffLng } = parseQuery.dropoffLocation.coordinates;
      
      // Function to calculate distance between two points in kilometers
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos((lat1 * Math.PI) / 180) * 
          Math.cos((lat2 * Math.PI) / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
      };

      // Filter vehicles within 10km of dropoff location
      if (vehicles.data && Array.isArray(vehicles.data)) {
        vehicles.data = vehicles.data.filter(vehicle => {
          if (!vehicle.dropoffLocation?.coordinates?.coordinates) return false;
          const [lng, lat] = vehicle.dropoffLocation.coordinates.coordinates;
          const distance = calculateDistance(
            dropoffLat, 
            dropoffLng, 
            lat, 
            lng
          );
          return distance <= 10; // 10km radius
        });

        // Update the total count and pages after filtering
        vehicles.totalItems = vehicles.data.length;
        vehicles.totalPages = Math.ceil(vehicles.totalItems / limit);
      }
    }

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.log(error);
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
