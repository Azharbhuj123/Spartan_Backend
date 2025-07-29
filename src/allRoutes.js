const express = require("express");
const router = express.Router();
const vehicleRoutes = require("./routes/vechile");
const paymentRoutes = require("./routes/payment");
const campaignRoutes = require("./routes/campaign");

router.use("/vehicle", vehicleRoutes);
router.use("/payment", paymentRoutes);
router.use("/campaign", campaignRoutes);

module.exports = router;
