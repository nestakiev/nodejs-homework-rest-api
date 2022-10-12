const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
// const sgMail = require("@sendgrid/mail");
require("dotenv").config();
// const { v4: uuidv4 } = require("uuid");
// const { emailConfimLayout } = require("../services/emailConfirmCreator");

const { User } = require("../db/authModel");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const registration = async (email, password, name) => {
  const user = await User.findOne({ email });
  if (user) {
    return "Email in use";
  }
  const hashPassword = await bcrypt.hash(password, 10);
  // const verificationToken = uuidv4();
  // const verificationLink = `${process.env.BASE_API_URL}/api/users/verify/${verificationToken}`;

  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    email,
    name,
    password: hashPassword,
    avatarURL
    // verificationToken,
  });

  // const msg = {
  //   to: email,
  //   from: process.env.EMAIL_SENDER,
  //   subject: "Verify your email",
  //   text: `For verify your email please click on ${verificationLink}`,
  //   html: emailConfimLayout(verificationLink),
  // };
  // sgMail.send(msg);
  console.log(newUser);

  const token = jwt.sign(
    {
      _id: newUser._id,
    },
    process.env.JWT_SECRET
  );

  const userWithToken = await User.findByIdAndUpdate(
    newUser._id,
    { token },
    { new: true }
  );

  return {
    token: userWithToken.token,
    user: {
      email: userWithToken.email,
      name: userWithToken.name,
      subscription: userWithToken.subscription,
      avatarURL: userWithToken.avatarURL,
    }
  };
};

const verify = async (token) => {
  const verifyUserInfo = await User.findOneAndUpdate(
    { verificationToken: token },
    { verify: true, verificationToken: null },
    { new: true }
  );

  return verifyUserInfo;
};

const repeatVerifyMessage = async (email) => {
  const verifyUserInfo = await User.findOne({ email, verify: false });

  if (verifyUserInfo) {
    // const verificationLink = `${process.env.BASE_API_URL}/api/users/verify/${verifyUserInfo.verificationToken}`;

    // const msg = {
    //   to: email,
    //   from: process.env.EMAIL_SENDER,
    //   subject: "Verify your email",
    //   text: `For verify your email please click on ${verificationLink}`,
    //   html: emailConfimLayout(verificationLink),
    // };
    // sgMail.send(msg);
  }

  return verifyUserInfo;
};

const login = async (email, password) => {
  const user = await User.findOne({email});

  // if(user?.verify === false) {
  //   return "Please, verify your email"
  // }

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
      name: userWithToken.name,
      subscription: userWithToken.subscription,
      avatarURL: userWithToken.avatarURL,
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
    name: newUserInfo.name,
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
  verify,
  repeatVerifyMessage,
  login,
  logout,
  updateUsersSubscription,
  updateAvatar,
};
