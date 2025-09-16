const express = require("express");
const router = express.Router();
const vehicleRoutes = require("./routes/vechile");
const paymentRoutes = require("./routes/payment");
const campaignRoutes = require("./routes/campaign");
const aboutusRoutes = require("./routes/aboutus");
const servicesRoutes = require("./routes/services");
const testimonialsRoutes = require("./routes/testimonials");
const faqRoutes = require("./routes/faq");

router.use("/vehicle", vehicleRoutes);
router.use("/payment", paymentRoutes);
router.use("/campaign", campaignRoutes);
router.use("/about", aboutusRoutes);
router.use("/services", servicesRoutes);
router.use("/testimonials", testimonialsRoutes);
router.use("/faqs", faqRoutes);

module.exports = router;
