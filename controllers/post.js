const post = require("../models/post");
const { paginateData } = require("../utils/helper");
const { postValidationSchema } = require("../utils/validation");

module.exports.addPost = async (req, res) => {
  try {
    await postValidationSchema.validateAsync(req.body);

    const createPost = await post.create(req.body);
    res.status(200).json({ data: createPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getPost = async (req, res) => {
  try {
    const data = await paginateData(post, page, limit, {});

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
