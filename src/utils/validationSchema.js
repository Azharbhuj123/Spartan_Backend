const Joi = require("joi");

module.exports.vehicleSchema = Joi.object({
  image: Joi.string().required().label('Image'),
  gallery: Joi.array().items(Joi.string()).label('Gallery'),
  name: Joi.string().required().label('Vehicle Name'),
  yearModel: Joi.string().required().label('Year Model'),
  pickupLocation: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }).required(),
    date: Joi.date().required()
  }).required(),
  dropoffLocation: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }).required(),
    date: Joi.date().required()
  }).required(),
  feautures: Joi.array().items(Joi.string())
});



 