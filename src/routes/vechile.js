const express = require("express");
const router = express.Router();
const vehicleController = require("../controller/vechile");
const { validate } = require("../middlewares/validate");
const { vehicleSchema } = require("../utils/validationSchema");
const upload = require("../middlewares/upload");

// Create a new vehicle
router.post("/", validate(vehicleSchema), vehicleController.addVehicle);
router.post("/store-search", vehicleController.storeSearch);
// Get all vehicles
router.get("/", vehicleController.getAllVehicles);


// Get single vehicle by ID
router.get("/:id", vehicleController.getVehicleById);

// Update vehicle by ID
router.put("/:id", vehicleController.updateVehicle);

// Delete vehicle by ID
router.delete("/:id", vehicleController.deleteVehicle);
router.post("/upload-image", upload.single("image"), vehicleController.uploadImage);


module.exports = router;
