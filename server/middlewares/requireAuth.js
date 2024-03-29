const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const requireAuth = async (req, res, next) => {
  const { authorization } = req.header;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];

  try {
    const { _id, phone } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id, phone }).select("_id");
    next();
  } catch (error) {
    return res.status(401).json({ error: "Requst is not authorized" });
  }
};

module.exports = requireAuth;
