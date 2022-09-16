const {
  registration,
  verify,
  repeatVerifyMessage,
  login,
  logout,
  updateUsersSubscription,
  updateAvatar,
} = require("../services/authService");

const registrationController = async (request, response) => {
  const { email, password } = request.body;

  const user = await registration(email, password);
  if (user === "Email in use") {
    return response.status(409).json({ message: "Email in use" });
  }

  response.status(201).json({ user });
};

const verifyController = async (request, response) => {
  const { verificationToken } = request.params;
  const verifiedUser = await verify(verificationToken);

  if (!verifiedUser) {
    return response.status(404).json({ message: "User not found" });
  }

  response.status(200).json({ message: "Verification successful" });
};

const repeatVarifyMessageController = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response
      .status(400)
      .json({ message: "missing required field email" });
  }
  const user = await repeatVerifyMessage(email);

  if (!user) {
    return response
      .status(404)
      .json({ message: "Verification has already been passed" });
  }

  response.status(200).json({ message: "Verification email sent" });
};

const loginController = async (request, response) => {
  const { email, password } = request.body;

  const userWithToken = await login(email, password);

  if (userWithToken === "Email or password is wrong") {
    return response.status(401).json({ message: "Email or password is wrong" });
  }

  response.status(200).json(userWithToken);
};

const logoutController = async (request, response) => {
  const { _id } = request.user;
  await logout(_id);
  response.status(204).json({ message: "Logout success" });
};

const currentUserController = (request, response) => {
  const { email, subscription } = request.user;
  response.status(200).json({ email, subscription });
};

const updateUsersSubcriptionController = async (request, response) => {
  const { _id } = request.user;
  const { subscription } = request.body;

  if (!["starter", "pro", "business"].includes(subscription)) {
    return response.status(400).json({
      message: "Subscription type may be one of starter, pro or business",
    });
  }
  const updatedUserInfo = await updateUsersSubscription(_id, subscription);

  response.status(200).json(updatedUserInfo);
};

const updateAvatarController = async (request, response) => {
  const { path: tempUpload, filename } = request.file;
  const { _id } = request.user;

  try {
    const avatarUrl = await updateAvatar(_id, tempUpload, filename);
    response.status(200).json(avatarUrl);
  } catch (err) {
    response.status(400).json({
      message: `Something went whong, please try again ${err.message}`,
    });
  }
};

module.exports = {
  registrationController,
  verifyController,
  repeatVarifyMessageController,
  loginController,
  logoutController,
  currentUserController,
  updateUsersSubcriptionController,
  updateAvatarController,
};
