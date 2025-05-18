const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(400).json({ message: "Authorizationtoken not found" });
  }
  // console.log(authToken, "token")
  try {
    let token = authToken.split("Bearer ");
    token = token[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store the decoded user information for future use
    next();
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Invalid authorization token", error: error });
  }
};
module.exports.verifyUser = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res
      .status(400)
      .send({ message: "Authorization user token not found" });
  }
  // console.log(authToken, "token")
  try {
    let token = authToken.split("Bearer ");
    token = token[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.role !== "user") {
      return res?.status(403)?.send({ message: "Access denied. Not a User" });
    }
    req.user = decoded; // Store the decoded user information for future use
    next();
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Invalid authorization token", error: error });
  }
};

module.exports.verifyAlumini = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res
      .status(400)
      .send({ message: "Authorization user token not found" });
  }
  // console.log(authToken, "token")
  try {
    let token = authToken.split("Bearer ");
    token = token[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.role !== "alumni") {
      return res?.status(403)?.send({ message: "Access denied. Not a alumni" });
    }
    req.user = decoded; // Store the decoded user information for future use
    next();
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Invalid authorization token", error: error });
  }
};

module.exports.verifyFaculty = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res
      .status(400)
      .send({ message: "Authorization user token not found" });
  }
  // console.log(authToken, "token")
  try {
    let token = authToken.split("Bearer ");
    token = token[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.role !== "faculty") {
      return res
        ?.status(403)
        ?.send({ message: "Access denied. Not a faculty" });
    }
    req.user = decoded; // Store the decoded user information for future use
    next();
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Invalid authorization token", error: error });
  }
};
