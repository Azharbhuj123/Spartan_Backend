const express = require("express");
const router = express.Router();
const vehicleRoutes = require("./routes/vechile");

router.use("/vehicle", vehicleRoutes);

module.exports = router;
