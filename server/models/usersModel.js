const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { Schema, SchemaTypes } = mongoose;
const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  intrests: { type: Array },
});

// login user

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All feilds must be filled");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect Password");
  }
  return user;
};

// signup user
userSchema.statics.signup = async function (name, email, password, phone) {
  //validation
  if (!name || !email || !password || !phone)
    throw Error("All feilds must be filled");

  if (!validator.isEmail(email)) throw Error("Email is not valid");

  if (!validator.isStrongPassword(password))
    throw Error("Password not strong enough");

  const exists = await this.findOne(
    {
      email: email,
    },
    { phone: phone }
  );

  if (exists) {
    throw Error("Email or Phone already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({
    name,
    email,
    password: hash,
    phone,
    intrests: [],
  });
  return user;
};
// Chack password of user
userSchema.statics.chackPassword = async function (_id, password) {
  // Validation
  if (!_id || !password) throw Error("All fields must be filled");

  const user = await this.findOne({ _id });

  if (!user) {
    throw Error("Incorrect _id");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

// Change password of user
userSchema.statics.changePassword = async function (_id, password) {
  // Validation
  if (!_id || !password) throw Error("All fields must be filled");

  if (!validator.isStrongPassword(password))
    throw Error("Password not strong enough");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.updateOne({ _id }, { $set: { password: hash } });

  if (!user) {
    throw Error("Incorrect _id");
  }

  return user;
};

module.exports = mongoose.model("users", userSchema);
