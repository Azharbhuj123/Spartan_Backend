const express = require('express');
const router = express.Router();
const { getAboutUs, updateAboutUs } = require('../controller/aboutus');

// @route   GET /api/about
// @desc    Get about us information
// @access  Public
router.get('/', getAboutUs);

// @route   PUT /api/about
// @desc    Update or create about us information
// @access  Private (You might want to add authentication middleware here)
router.put('/', updateAboutUs);

module.exports = router;
