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




 