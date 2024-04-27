const User = require("../models/User");
const Note = require("../models/Note");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route Get /users
// @access Private
const getALlUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found!" });
  }
  res.json(users);
}

// @desc Create new users
// @route POST /users
// @access Private
const createUser = async (req, res) => {
  const { username, password, roles } = req.body;

  //confirm data
  if (!username || !password ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check any duplicates in user name
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username " });
  }

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = (!Array.isArray(roles) || !roles.length)?{ username, password: hashedPwd}:
 { username, password: hashedPwd, roles }

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    // Created
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
}

// @desc update users
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Does the user exits to update
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for Duplicates
  const duplicate = await User.findOne({ username }).lean().exec();

  //Allow original user to update
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
}

// @desc Delete users
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();
  // console.log("USER", user)

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const deletedUser = { username: user.username, _id: user._id }; // Store username and ID before deleting
  await user.deleteOne(); // Delete user

  const reply = `Username ${deletedUser.username} with ID ${deletedUser._id} deleted`;

  res.json(reply);
}

module.exports = {
  getALlUsers,
  createUser,
  updateUser,
  deleteUser,
};
