const express = require('express');
const router = express.Router();
const { 
  getTestimonials, 
  getTestimonialById, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} = require('../controller/testimonials');

// @route   GET /api/testimonials
// @desc    Get all testimonials
// @access  Public
router.get('/', getTestimonials);

// @route   GET /api/testimonials/:id
// @desc    Get single testimonial by ID
// @access  Public
router.get('/:id', getTestimonialById);

// @route   POST /api/testimonials
// @desc    Create a new testimonial
// @access  Private (Add authentication middleware if needed)
router.post('/', createTestimonial);

// @route   PUT /api/testimonials/:id
// @desc    Update a testimonial
// @access  Private (Add authentication middleware if needed)
router.put('/:id', updateTestimonial);

// @route   DELETE /api/testimonials/:id
// @desc    Delete a testimonial
// @access  Private (Add authentication middleware if needed)
router.delete('/:id', deleteTestimonial);

module.exports = router;
