const express = require('express');
const router = express.Router();
const { 
  getFAQs, 
  getFAQById, 
  createFAQ, 
  updateFAQ, 
  deleteFAQ 
} = require('../controller/faq');

// @route   GET /api/faqs
// @desc    Get all FAQs
// @access  Public
router.get('/', getFAQs);

// @route   GET /api/faqs/:id
// @desc    Get single FAQ by ID
// @access  Public
router.get('/:id', getFAQById);

// @route   POST /api/faqs
// @desc    Create a new FAQ
// @access  Private (Add authentication middleware if needed)
router.post('/', createFAQ);

// @route   PUT /api/faqs/:id
// @desc    Update a FAQ
// @access  Private (Add authentication middleware if needed)
router.put('/:id', updateFAQ);

// @route   DELETE /api/faqs/:id
// @desc    Delete a FAQ
// @access  Private (Add authentication middleware if needed)
router.delete('/:id', deleteFAQ);

module.exports = router;
