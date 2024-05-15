const express = require("express");
const router = express.Router();
const productContoller = require("../controller/productContoller");
router.route("/").get(productContoller.getAllProducts);

router.route("/addProduct").post(productContoller.addProduct);
router
  .route("/:id")
  .delete(productContoller.deleteProduct)
  .patch(productContoller.editProduct);

module.exports = router;
