const express = require("express");
const router = express.Router();

const { isLoggined, isAdmin } = require("../middlewares/handlers");

const authRouter = require("./auth");
const userRouter = require("./user");

router.use("/auth", authRouter);
router.use("/user", isLoggined, userRouter);

module.exports = router;