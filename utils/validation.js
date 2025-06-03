const Joi = require("joi");

module.exports.postValidationSchema = Joi.object({
  image: Joi.string().uri().optional().label("Image"),
  title: Joi.string().optional().label("Title"),
  imageDesc: Joi.string().optional().label("Image Description"),
  description: Joi.string().optional().label("Description"),
});
