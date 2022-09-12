const {
  registration,
  login,
  logout,
  updateUsersSubscription,
} = require("../services/authService");

const registrationController = async (request, response) => {
  const { email, password } = request.body;

  const user = await registration(email, password);
  if (user === "Email in use") {
    return response.status(409).json({ message: "Email in use" });
  }

  response.status(201).json({ user });
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
    return response
      .status(400)
      .json({
        message: "Subscription type may be one of starter, pro or business",
      });
  }
  const updatedUserInfo = await updateUsersSubscription(_id, subscription);

  response.status(200).json(updatedUserInfo);
};

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
  updateUsersSubcriptionController,
};
