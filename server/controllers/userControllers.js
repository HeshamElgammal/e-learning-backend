const jwt = require("jsonwebtoken");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const User = require("../models/usersModel");
const { Otp } = require("../models/otpModel");
const createToken = (_id, phone) => {
  return jwt.sign({ _id, phone }, process.env.SECRET, { expiresIn: "10d" });
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
  console.log("====================================");
  // console.log(req);
  console.log(req);
  console.log("====================================");
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create token
    const token = createToken(user._id, user.phone);

    res.status(200).json({ name: user.name, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// sign up

module.exports.signupUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  console.log(req.body);
  try {
    const user = await User.signup(name, email, password, phone);
    const token = createToken(user._id, user.phone);
    res.status(200).json({
      user: { name: user.name, phone: user.phone, email: user.email, token },
      status: 1,
    });
  } catch (error) {
    res.status(400).json({ error: error.message, status: 0 });
  }
};

module.exports.forgetPassword = async (req, res) => {
  const { phone } = req.body;
  console.log(req.body);
  try {
    const foundUser = await User.findOne({ phone });
    if (foundUser)
      return res
        .status(400)
        .json({ message: "User already Found!", status: 0 });

    const OTP = OtpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    console.log("====================================");
    console.log(OTP);
    console.log("====================================");

    const otp = new Otp({ phone: phone, otp: OTP });
    const foundPhone = await Otp.findOne({ phone });
    if (foundPhone)
      return res
        .status(400)
        .json({ message: "Wait for a 5 minutes!", status: 0 });
    const salt = await bcrypt.genSalt(10);

    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res
      .status(200)
      .json({ message: "Otp send Suuccessfully!", status: 1, code: OTP });
  } catch (error) {
    res.status(400).json({ error: error.message, status: 0 });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { otp, phone } = req.body;
  try {
    const otpHolder = await Otp.find({
      phone,
    });
    if (otpHolder.length === 0)
      return res.status(400).json({ message: "Otp is expired!", status: 0 });

    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(otp, rightOtpFind.otp);
    if (rightOtpFind.phone == phone && validUser) {
      const OtpDelete = await Otp.deleteMany({
        phone: phone,
      });
      return res.status(200).json({ message: "verified", success: 1 });
    } else {
      return res
        .status(400)
        .json({ message: "Your Otp was wrong", success: 0 });
    }
  } catch (error) {
    res.status(400).json({ error: error.message, status: 0 });
  }
};
