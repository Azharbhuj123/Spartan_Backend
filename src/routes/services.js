const express = require('express');
const router = express.Router();
const { 
  getServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} = require('../controller/services');

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', getServices);

// @route   GET /api/services/:id
// @desc    Get single service by ID
// @access  Public
router.get('/:id', getServiceById);

// @route   POST /api/services
// @desc    Create a new service
// @access  Private (Add authentication middleware if needed)
router.post('/', createService);

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private (Add authentication middleware if needed)
router.put('/:id', updateService);

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Private (Add authentication middleware if needed)
router.delete('/:id', deleteService);

module.exports = router;
