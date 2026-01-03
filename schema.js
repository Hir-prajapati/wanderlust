const Joi = require('joi');

// module.exports.listingSchema=Joi.object({
//     listing:Joi.object({
//         title:Joi.string().required(),
//         description:Joi.string().required(),
//         location:Joi.string().required(),
//         country:Joi.string().required(),
//         price:Joi.number().required(),
//         image:Joi.string().allow("", null)
//     }).required()
// });

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.object({
      url: Joi.string().allow('', null)
    }).optional(),
    category: Joi.string().valid(
      "Trending",
      "Rooms",
      "Iconic City",
      "Mountain",
      "Castles",
      "Camping",
      "Farms",
      "Arctic",
      "Beachfront",
      "Luxury",
      "Historical",
      "Desert"
    ).required(),
  }).required()
});


module.exports.reviewSchema = Joi.object({
  review:Joi.object({
    rating:Joi.number().required().min(1).max(5 ),
    comment: Joi.string().required()
  }).required()
})