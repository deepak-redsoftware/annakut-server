import { UserService } from "../../services/index.js";
import asyncHandler from "../../middlewares/async-handler.js";
import { hashPassword } from "../../utils/hash-password.js";

const userService = new UserService();

// @desc    Register user
// @route   POST /users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, password, mobile_number, role } = req.body;

  if (!name?.trim() || !password || !mobile_number?.trim() || !role?.trim()) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (
    role?.trim() !== "Admin" &&
    role?.trim() !== "IT Nirikshak" &&
    role?.trim() !== "Sevak"
  ) {
    res.status(400);
    throw new Error("Invalid Role");
  }

  const user = await userService.register({
    name: name?.trim(),
    password,
    mobile_number: mobile_number?.trim(),
    role: role?.trim(),
  });

  if (user) {
    res.status(201).json({
      status: "success",
      data: {
        name: user.name,
        userID: user.userID,
        role: user.role,
      },
    });
  } else {
    throw new Error("Invalid user data");
  }
});

// @desc    Login user
// @route   POST /users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { userID, password } = req.body;

  if (!userID.trim() || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await userService.getUserByUserID(userID.trim());

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role !== "Admin" && user.security_answer === null) {
    res.status(400);
    throw new Error("Signup required first");
  }

  if (user && (await user.matchPassword(password))) {
    const token = userService.signIn(user);

    return res.status(200).json({
      status: "success",
      data: {
        name: user.name,
        userID: user.userID,
        role: user.role,
        token,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid userID or password");
  }
});

// @desc    Get current logged-in user
// @route   GET /users
// @access  Protected
const getAuthenticatedUser = asyncHandler(async (req, res) => {
  const user = await userService.getLoggedInUser(req.user);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc    Reset password by choice | Reset password on first login
// @route   POST /users/reset
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { userID, security_question, security_answer, password } = req.body;

  if (!userID || !security_question || !security_answer || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await userService.getUserByUserID(userID);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const hashedPassword = await hashPassword(password);

  const { role } = await userService.update(user._id, {
    security_question,
    security_answer,
    password: hashedPassword,
  });

  return res.status(200).json({
    status: "success",
    data: {
      userID,
      role,
    },
  });
});

export { registerUser, loginUser, getAuthenticatedUser, resetPassword };
