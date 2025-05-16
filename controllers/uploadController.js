module.exports.postUpload = async (req, res) => {
  try {
    const imageUrl = req.file.filename;

    res.send({
      url: imageUrl,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};
