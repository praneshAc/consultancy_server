const express = require("express");
const router = express.Router();
const adminLoginContoller = require("../controller/adminContoller");
router.route("/login").post(adminLoginContoller.adminLogin);
router.route("/orders").get(adminLoginContoller.getAllOrder);
router.route("/orders/:orderId").patch(adminLoginContoller.changeStatus);
router.route("/customers").get(adminLoginContoller.getAllUser);
router.route("/statistics").get(adminLoginContoller.calculateStatistics);
module.exports = router;
