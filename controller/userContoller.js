const User = require("../modals/userModal");
const createError = require("../utils/appError");
exports.changeUserAddress = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { address, city, pincode } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { address, city, pincode } },
      { new: true, omitUndefined: true }
    );
    if (!updatedUser) {
      return next(new createError("User not found", 404));
    }

    const { _id, name, email, phone } = updatedUser;

    res.status(200).json({
      status: "success",
      user: {
        _id,
        name,
        email,
        phone,
        shippingAddress: {
          street: address,
          city,
          pincode,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
