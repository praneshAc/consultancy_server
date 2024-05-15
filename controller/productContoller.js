const Product = require("../modals/productModal");
const multer = require("multer");
const sharp = require("sharp");
const { uploadFileToS3 } = require("../utils/uploadFiletos3.js");

const upload = multer();

exports.addProduct = async (req, res, next) => {
  try {
    upload.single("file")(req, res, async (error) => {
      if (error) {
        return res.status(400).json({
          status: "fail",
          message: "Error uploading file",
        });
      }
      const formData = req.body;
      const file = req.file;
      if (!file) {
        return res.status(404).json({
          status: "fail",
          message: "No File found",
        });
      }
      const buffer = Buffer.from(file.buffer);
      const resizedBuffer = await sharp(buffer)
        .resize({ width: 400, height: 300 })
        .toBuffer();
      const { name, description, price } = formData;
      const image = await uploadFileToS3(
        resizedBuffer,
        file.originalname,
        "products"
      );
      const product = await Product.create({
        name,
        description,
        price,
        image,
      });
      return res.status(201).json({
        status: "success",
        message: "product created successfully",
        data: product,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      err,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  const product = await Product.find();
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).json({
      status: "success",
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updatedProduct = await Product.findById(id);
    if (!updatedProduct) {
      return res.status(404).send({ error: "Product not found" });
    }
    Object.keys(updates).forEach((update) => {
      updatedProduct[update] = updates[update];
    });
    await updatedProduct.save();

    res.status(200).json({
      status: "success",
      data: {
        updatedProduct,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
