const jwt = require("jsonwebtoken");
const { User } = require("../db/authModel");

const authMiddleware = async (request, response, next) => {
  try {
    const authorization = request.get("Authorization");

    if (!authorization) {
      return response.status(401).json({ message: "Not authorized" });
    }

    const [, token] = authorization.split(" ");

    if (!token) {
      return response.status(401).json({ message: "Not authorized" });
    }

    const tokenInfo = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenInfo._id);

    if (!user || !(user.token === token)) {
      return response.status(401).json({ message: "Not authorized" });
    }
    request.user = user;
    next();
  } catch (err) {
    return response.status(401).json({ message: "Not authorized" });
  }
};

module.exports = {
  authMiddleware,
};
