const Testimonial = require("../models/testimonials");

// Get all testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error getting testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonials',
      error: error.message
    });
  }
};

// Get single testimonial by ID
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error getting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonial',
      error: error.message
    });
  }
};

// Create new testimonial
const createTestimonial = async (req, res) => {
  try {
    const { image, name, designation, title, description, rating } = req.body;
    
    if (!name || !title || !description || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, title, description, and rating'
      });
    }

    const newTestimonial = new Testimonial({
      image,
      name,
      designation,
      title,
      description,
      rating
    });

    const savedTestimonial = await newTestimonial.save();
    
    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: savedTestimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating testimonial',
      error: error.message
    });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { image, name, designation, title, description, rating } = req.body;
    const updateData = {};
    
    if (image) updateData.image = image;
    if (name) updateData.name = name;
    if (designation) updateData.designation = designation;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (rating) updateData.rating = rating;

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updatedTestimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating testimonial',
      error: error.message
    });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!deletedTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting testimonial',
      error: error.message
    });
  }
};

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
