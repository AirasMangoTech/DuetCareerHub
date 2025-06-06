module.exports.postUpload = async (req, res) => {
  try {
    const documentFile = req.files["document"]?.[0];
    const resumeFile = req.files["resume"]?.[0];

    const response = {};

    if (documentFile) {
      response.url = documentFile.filename;
    }

    if (resumeFile) {
      response.resumeUrl = resumeFile.filename;
    }

    res.send(response);
  } catch (error) {
    res.status(400).json({
      status: false,
      responseCode: 400,
      message: error.message,
    });
  }
};
