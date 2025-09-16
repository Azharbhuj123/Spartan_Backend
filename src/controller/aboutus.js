const AboutUs = require("../models/aboutus");

// Get about us information
const getAboutUs = async (req, res) => {
  try {
    // Find the first about us document
    const aboutUs = await AboutUs.findOne();
    
    // If no document exists, return empty data
    if (!aboutUs) {
      return res.status(200).json({
        success: true,
        data: {}
      });
    }
    
    res.status(200).json({
      success: true,
      data: aboutUs
    });
  } catch (error) {
    console.error('Error getting about us:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching about us information',
      error: error.message
    });
  }
};

// Create or update about us information
const updateAboutUs = async (req, res) => {
  try {
    const { description, image } = req.body;
    
    // Find the first about us document or create a new one if it doesn't exist
    const aboutUs = await AboutUs.findOneAndUpdate(
      {},
      { description, image },
      { 
        new: true,  // Return the updated document
        upsert: true,  // Create the document if it doesn't exist
        setDefaultsOnInsert: true
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'About us information updated successfully',
      data: aboutUs
    });
  } catch (error) {
    console.error('Error updating about us:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating about us information',
      error: error.message
    });
  }
};

module.exports = {
  getAboutUs,
  updateAboutUs
};
