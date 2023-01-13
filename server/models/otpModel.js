const mongoose = require("mongoose");
const { Schema, model } = mongoose;

module.exports.Otp = model(
  "Otp",
  Schema(
    {
      phone: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 },
      },
      // After 5 minutes it deleted automatically from the database
    },
    { timestamps: true }
  )
);
