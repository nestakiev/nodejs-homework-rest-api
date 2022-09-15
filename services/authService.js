const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");

const { User } = require("../db/authModel");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const registration = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    return "Email in use";
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    email,
    password: hashPassword,
    avatarURL,
  });
  return {
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
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
      // avatarURL: userWithToken.avatarURL,
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
  return {
    email: newUserInfo.email,
    subscription: newUserInfo.subscription,
    avatarURL: newUserInfo.avatarURL,
  };
};

const updateAvatar = async (id, tempUpload, filename) => {
  const [extention] = filename.split(".").reverse();
  const avatarName = `${id}.${extention}`;
  const resultUpload = path.join(avatarsDir, avatarName);
  const avatar = await Jimp.read(tempUpload);
  await avatar.resize(250, 250).write(resultUpload);
  await fs.unlink(tempUpload);
  const avatarURL = path.join("/avatars", avatarName);

  const newUsersAvatar = await User.findOneAndUpdate(
    { _id: id },
    { avatarURL },
    { new: true }
  );

  return {
    avatarURL: newUsersAvatar.avatarURL,
  };
};

module.exports = {
  registration,
  login,
  logout,
  updateUsersSubscription,
  updateAvatar,
};
