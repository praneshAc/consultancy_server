const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../utils/appError");
const User = require("../modals/userModal");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, address, city, pincode } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new createError("User already exist!", 400));
    }

    const encryptedPassword = await bycrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: encryptedPassword,
      address,
      city,
      pincode,
    });
    const token = jwt.sign({ _id: newUser._id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "12h",
    });

    res.status(201).json({
      status: "success",
      message: "user registered successfully",
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new createError("User not found!", 401));

    const isPasswordTrue = await bycrypt.compare(password, user.password);
    if (!isPasswordTrue) {
      return next(new createError("Invalid password", 401));
    }

    const token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "12h",
    });

    res.status(200).json({
      status: "success",
      token,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shippingAddress: {
          street: user.address,
          city: user.city,
          pincode: user.pincode,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
