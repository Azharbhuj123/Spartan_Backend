const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');

// POST /contact - Submit contact form
router.post('/', contactController.submitContactForm);

// GET /contact - Get all contact forms
router.get('/', contactController.getContactForm);

// GET /contact/:id - Get single contact form by ID
router.get('/:id', contactController.getContactById);

module.exports = router;
