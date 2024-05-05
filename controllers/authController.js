const jwt = require("jsonwebtoken");
const User = require("../db").User;
const bcrypt = require("bcrypt");
const config = require("../config/env/development");

const currentTime = new Date();

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

// generate_otp
function generate_otp(n) {
  var add = 1,
    max = 12 - add;
  if (n > max) {
    return generate_otp(max) + generate_otp(n - max);
  }
  max = Math.pow(10, n + add);
  var min = max / 10;
  var number = Math.floor(Math.random() * (max - min + 1)) + min;
  return ("" + number).substring(add);
}

// login with mobile
const loginWithMobile = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      message: "Either mobile or password is missing",
      status: "warning",
    });
  }

  const check_user = await User.findOne({ mobile });
  if (!check_user) {
    return res.status(400).json({
      message: "No user found with this mobile",
      status: "warning",
    });
  }

  const passwordMatch = await bcrypt.compare(password, check_user.password);

  if (!passwordMatch) {
    return res.status(400).json({
      message: "The password you entered is incorrect",
      status: "warning",
    });
  }

  const token = generateToken(check_user._id);
  const user = await User.findOne({ mobile });
  await User.updateOne(
    { mobile: mobile },
    {
      token: token,
      updated_at: currentTime,
      data: {
        user,
      },
    }
  );

  res.status(200).json({
    message: "Login successfully",
    status: "success",
    token: token,
    data: {
      user,
    },
  });
};

//Send Otp
const sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (mobile == " ") {
    return res.status(400).json({
      message: "Please enter mobile number first",
      status: "warning",
    });
  }

  const otp = generate_otp(4);

  const updateOtp = await User.updateOne({ mobile: mobile }).set({
    otp: otp,
  });

  return res.json({
    message: "OTP has been sent on your mobile",
    status: "success",
    otp: otp,
  });
};

// signup
const signup = async (req, res) => {
  const { password, confirmPassword, firstName, lastName, mobile, email } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !confirmPassword ||
    !mobile ||
    !password ||
    !email
  ) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "Password and confirm password do not match",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    // const userMobile = await User.findOne({ mobile: mobile });
    // console.log(userMobile);
    // if (userMobile) {
    //   return res.json({
    //     message: "Already user exists",
    //     status: "warning",
    //   });
    // }
    const newUser = await User.create({
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
      email: email,
      updated_at: currentTime,
    });

    console.log("User details saved");

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const loginWithEmail = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      message: "Enter enter email and password",
    });
  }

  const check_user = await User.findOne({ email });
  console.log(check_user);
  if (!check_user) {
    return res.status(400).json({
      message: "Enter valid email",
      status: "warning",
    });
  }
  const passwordMatch = await bcrypt.compare(password, check_user.password);

  if (!passwordMatch) {
    return res.status(400).json({
      message: "Enter valid password",
      status: "warning",
    });
  }
  console.log(passwordMatch);

  // const user = await User.findOne({ email });
  const token = generateToken(check_user._id);
  await User.updateOne(
    { email: email },
    {
      token: token,
      updated_at: currentTime,
    }
  );

  res.status(200).json({
    message: "Login successfully",
    status: "success",
    data: {
      check_user,
    },
  });
};

module.exports = {
  loginWithMobile,
  loginWithEmail,
  sendOtp,
  signup,
};
