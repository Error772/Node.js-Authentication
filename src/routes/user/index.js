const express = require("express");
const router = express.Router();

const UserController = require("./controller");

router.get("/me", UserController.me);

router.get("/logout", UserController.logout);

module.exports = router;