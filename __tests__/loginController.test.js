const { loginController } = require("../controllers/authController");
const { User } = require("../db/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

describe("Login controller test", () => {
  it("should call response.status with code 200 and return body with token and short info and user's info (token, email, subscription)", async () => {
    const mReq = {
      body: {
        email: "testtest@mail.com",
        password: "testpassword",
        subscription: "starter",
      },
    };
    const mockStatus = jest.fn((value) => mRes);
    const mockJson = jest.fn();
    const mRes = {
      status: mockStatus,
      json: mockJson,
    };

    const hashPassword = await bcrypt.hash(mReq.body.password, 10);

    const mUser = {
      email: mReq.body.email,
      password: hashPassword,
      _id: "123456789",
    };

    const mToken = jwt.sign(
      {
        _id: mUser._id,
      },
      process.env.JWT_SECRET
    );

    jest.spyOn(User, "findOne").mockImplementationOnce(async () => mUser);
    jest
      .spyOn(User, "findByIdAndUpdate")
      .mockImplementationOnce(async (_, token) => {
        return {
          ...mUser,
          ...token,
        };
      });

    await loginController(mReq, mRes);

    expect(mockStatus).toHaveBeenCalledWith(200);

    expect(mockJson).toHaveBeenCalledWith({
      token: mToken,
      user: {
        email: mUser.email,
        subscription: mUser.subscription,
      },
    });
  });
});
