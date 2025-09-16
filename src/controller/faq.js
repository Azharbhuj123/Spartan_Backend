const FAQ = require("../models/faq");

// Get all FAQs
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    console.error('Error getting FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching FAQs',
      error: error.message
    });
  }
};

// Get single FAQ by ID
const getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('Error getting FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching FAQ',
      error: error.message
    });
  }
};

// Create new FAQ
const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both question and answer'
      });
    }

    const newFAQ = new FAQ({
      question,
      answer
    });

    const savedFAQ = await newFAQ.save();
    
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: savedFAQ
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating FAQ',
      error: error.message
    });
  }
};

// Update FAQ
const updateFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const updateData = {};
    
    if (question) updateData.question = question;
    if (answer) updateData.answer = answer;

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedFAQ) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: updatedFAQ
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating FAQ',
      error: error.message
    });
  }
};

// Delete FAQ
const deleteFAQ = async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
    
    if (!deletedFAQ) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting FAQ',
      error: error.message
    });
  }
};

module.exports = {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
