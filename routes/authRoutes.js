const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

router.post("/login/mobile", authController.loginWithMobile);
router.post("/login/email", authController.loginWithEmail);

module.exports = router;
