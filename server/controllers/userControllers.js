const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "10d" });
};

// get user
module.exports.getUser = async (req, res) => {
  const email = req.body.email;

  User.findOne({ email })
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ error: "user not found" });
      }
    })
    .catch((err) => console.log(err));
};

// login user
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ name: user.name, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// sign up

module.exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.signup(name, email, password);
    const token = createToken(user._id);
    res.status(200).json({ name: user.nam, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
