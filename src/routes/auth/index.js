const express = require("express");
const router = express.Router();
const validator = require("../../middlewares/validator");

const AuthController = require("./controller");

router.post(
    "/register",
    validator.registerValidator(),
    AuthController.register
);

router.post("/login", validator.loginValidator(), AuthController.login);

module.exports = router;
