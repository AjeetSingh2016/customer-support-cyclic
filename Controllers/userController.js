const { response } = require("express");
const expres = require("express");
const User = require("../models/userModel");
const createToken = require("./Config/CreateToken");
const { hashPassword, comparePasswords } = require("./Config/PasswordHashing");



const fetchOneUser = async (req, res) => {
  const _id = req.query.userId;
  console.log(_id);
  try {
      const user = await User.findOne({ _id });
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json(error);
  }

};

const loginController = async (req, res) => {
  console.log("LoginController");
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const isPasswordCorrect = await comparePasswords(password, user.password);
    if (isPasswordCorrect) {
      // Send a success respons
      const token = createToken(user._id);
      return res.status(201).json({
        name: user.name,
        id: user._id,
        email: user.email,
        token: token,
      });
    } else {
      return res.status(400).send("Invalid username or password");
    }
  } else {
    return res.status(400).send("Invalid username or password");
  }
};

const registerController = async (req, res) => {
  console.log("Register controller");
  const { name, email, password} = req.body;
  // check for all fields
  const isAgent = true;
  if (!name || !email || !password) {
    res.status(400).send("Input required");
  }
  // check if the user is already registered
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).send("User already registered");
  }

  // check if the user is already registered
  const userNameExist = await User.findOne({ name });
  if (userNameExist) {
    return res.status(400).send("User Name taken");
  }

  // Create a new user

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    isAgent,
  });

  if (newUser) {
    // Send a success response if user is created
    const token = createToken(newUser._id);
    return res.status(201).json({
      name: newUser.name,
      id: newUser._id,
      email: newUser.email,
      token: token,
    });
  } else {
    return res.status(400).send("Server Error");
  }
};

const fetchUsersExceptUser = async (req, res) => {
  try {
    const userIdToExclude = req.query.userId; // Get the user ID from the request query

    // Use Mongoose to find all users except the one with the specified ID
    const users = await User.find({ _id: { $ne: userIdToExclude } });

    // Send the list of users as a JSON response
    res.json(users);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUser = async(req, res)=>{
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Check if status is provided in the request body
    if (status === undefined) {
      return res.status(400).json({ error: 'Status is required in the request body' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  loginController,
  registerController,
  fetchUsersExceptUser,
  fetchOneUser,
  updateUser
};
