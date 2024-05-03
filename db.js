const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/login-backend");
console.log("mongodb is connected");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  otp: {
    type: Number,
  },
  token: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  updated_at: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
