const post = require("../models/post");
const {
  paginateData,
  getAllReceiverIds,
  userData,
} = require("../utils/helper");
const sendNotification = require("../utils/notification");
const { postValidationSchema } = require("../utils/validation");

module.exports.addPost = async (req, res) => {
  const user = req.user;
  const { title, description } = req.body;
  try {
    const findUser = await userData(user?._id, "name");

    await postValidationSchema.validateAsync(req.body);

    const createPost = await post.create({
      user: user?._id,
      creator: user?.role.charAt(0).toUpperCase() + user?.role.slice(1),

      ...req.body,
    });
    getAllReceiverIds()
      .then((receivers) => {
        sendNotification({
          req,
          title: `${findUser?.name} Has Created A New Post`,
          description,
          receiverIds: receivers,
        }).catch((err) => console.error("Notification error:", err));
      })
      .catch((err) => console.error("Receiver fetch error:", err));
    res.status(200).json({ data: createPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getPost = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  try {
    let query = {};
    if (search) {
      query.title = { $regex: new RegExp(search, "i") };
    }
    const data = await paginateData(post, page, limit, query);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getmyPost = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const user = req.user._id;

  try {
    let query = { user };
    if (search) {
      query.title = { $regex: new RegExp(search, "i") };
    }
    const data = await paginateData(post, page, limit, query);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await post.findById(id);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPost = await post.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ data: updatedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
