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

router.post(
    "/forget-password",
    validator.forgetValidator(),
    AuthController.forget_Password
);

router.get("/reset-password", AuthController.reset_Password_Redirect);

router.post(
    "/reset-password",
    validator.reset_PassValidator(),
    AuthController.reset_Password
);

module.exports = router;
