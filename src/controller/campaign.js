const Campaign = require("../models/campaign");
const { paginateData } = require("../utils/helper");
const {
  campaignSchema,
  updateCampaignSchema,
} = require("../utils/validationSchema");

// Create a new campaign
exports.addCampaign = async (req, res) => {
  try {
    const { error } = campaignSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const campaign = new Campaign(req.body);
    await campaign.save();

    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  const { page = 1, limit = 10, searchQuery = {} } = req.query;
  try {
    const query = {};
    
    if (searchQuery.name) {
      query.name = { $regex: searchQuery.name, $options: "i" };
    }
    if (searchQuery.status) {
      query.status = searchQuery.status;
    }
    if (searchQuery.startDate && searchQuery.endDate) {
      query.startDate = { $lte: new Date(searchQuery.endDate) };
      query.endDate = { $gte: new Date(searchQuery.startDate) };
    }

    const campaigns = await paginateData(
      Campaign,
      page,
      limit,
      query,
      "-updatedAt -__v"
    );

    res.status(200).json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.useCampaign =async(req,res)=>{
  const {redemCode,email} = req.body;
    try {
        const campaign = await Campaign.findOne({redemCode});
        if(!campaign){
            return res.status(404).json({
                success:false,
                error:"Campaign not found"
            })
        }
        if(campaign.status !== "Active"){
            return res.status(400).json({
                success:false,
                error:"Campaign is not active"
            })      
        }
        if(campaign.endDate < new Date()){
            return res.status(400).json({
                success:false,
                error:"Campaign is expired"
            })      
        }
        if(campaign?.redemBy?.includes(email)){
            return res.status(400).json({
                success:false,
                error:"Campaign is already redeemed"
            })      
        }
        campaign.redemBy?.push(email);
        await campaign.save();
        res.status(200).json({
            success:true,
            message:"Campaign redeemed successfully",
            data:campaign
        })
        

    } catch (error) {
      console.log(error);
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

// Get single campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update campaign by ID
exports.updateCampaign = async (req, res) => {
  try {
    const { error } = updateCampaignSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete campaign by ID
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found",
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
