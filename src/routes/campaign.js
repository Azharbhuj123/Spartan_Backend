const express = require("express");
const router = express.Router();
const campaignController = require("../controller/campaign");
const { validate } = require("../middlewares/validate");
const { campaignSchema } = require("../utils/validationSchema");

// Create a new campaign
router.post("/", validate(campaignSchema), campaignController.addCampaign);
router.post("/use", campaignController.useCampaign);

// Get all campaigns
router.get("/", campaignController.getAllCampaigns);

// Get single campaign by ID
router.get("/:id", campaignController.getCampaignById);

// Update campaign by ID
router.put("/:id", campaignController.updateCampaign);

// Delete campaign by ID
router.delete("/:id", campaignController.deleteCampaign);

module.exports = router;