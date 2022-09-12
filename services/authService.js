const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../db/authModel");

const registration = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    return "Email in use";
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashPassword });
  return {
    email: newUser.email,
    subscription: newUser.subscription,
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return "Email or password is wrong";
  }

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  const userWithToken = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );
  return {
    token: userWithToken.token,
    user: {
      email: userWithToken.email,
      subscription: userWithToken.subscription,
    },
  };
};

const logout = async (id) => {
  await User.findByIdAndUpdate(id, { token: "" });
};

const updateUsersSubscription = async (id, subscription) => {
  const newUserInfo = await User.findOneAndUpdate(
    { _id: id },
    { subscription },
    { new: true }
  );
  return { email: newUserInfo.email, subscription: newUserInfo.subscription };
};

module.exports = {
  registration,
  login,
  logout,
  updateUsersSubscription,
};
