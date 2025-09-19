const Contact = require('../models/contact');

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required fields'
            });
        }

        const newContact = new Contact({
            name,
            email,
            phone: phone || '',
            message
        });

        await newContact.save();

        res.status(201).json({
            success: true,
            message: 'Your message has been submitted successfully!'
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while submitting the form'
        });
    }
};


exports.getContactForm = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contact forms:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact forms'
        });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact form not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Error fetching contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact form',
            error: error.message
        });
    }
};
