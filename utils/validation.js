const Joi = require("joi");

module.exports.postValidationSchema = Joi.object({
  image: Joi.string().uri().required().label("Image"),
  title: Joi.string().required().label("Title"),
  imageDesc: Joi.string().optional().label("Image Description"),
  description: Joi.string().required().label("Description"),
});
