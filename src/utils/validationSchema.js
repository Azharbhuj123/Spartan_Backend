const Joi = require("joi");

module.exports.vehicleSchema = Joi.object({
  image: Joi.string().required().label('Image'),
  gallery: Joi.array().items(Joi.string()).label('Gallery'),
  name: Joi.string().required().label('Vehicle Name'),
  description: Joi.string().required().label('Vehicle Name'),
  yearModel: Joi.string().required().label('Year Model'),
  pickupLocation: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      type: Joi.string().valid("Point").required(),
      coordinates: Joi.array().items(Joi.number().required()).length(2).required()
    }).required(),
    date: Joi.date().required()
  }).required(),

  dropoffLocation: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      type: Joi.string().valid("Point").required(),
      coordinates: Joi.array().items(Joi.number().required()).length(2).required()
    }).required(),
    date: Joi.date().required()
  }).required(),
  features: Joi.array().items(Joi.string()),
  vehicle_specifying:Joi.object().required(),
  pickupDate:Joi.optional(),
  dropoffDate:Joi.optional(),
  price: Joi.number().required(),
});


module.exports.campaignSchema = Joi.object({
  name: Joi.string().required().label('Campaign Name'),
  discount: Joi.number().required().label('Discount'),
  description: Joi.string().required().label('Description'),
  redemCode: Joi.string().label('Redemption Code'),
  startDate: Joi.date().required().label('Start Date'),
  endDate: Joi.date().required().label('End Date'),
  status: Joi.string().required().label('Status'),
  redemBy: Joi.array().items(Joi.string()).label('Redemption By'),
});




 