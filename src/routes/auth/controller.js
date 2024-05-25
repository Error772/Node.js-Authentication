const User = require("../../models/User");
const config = require("config");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const { response, display_error } = require("../controller");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.get("smtp.email"),
        pass: config.get("smtp.password"),
    },
});

function generate_Token(token) {
    return crypto.createHash("sha3-256").update(token).digest("hex");
}

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password, recaptchaToken } = req.body;

            const recaptchaResponse = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify`,
                null,
                {
                    params: {
                        secret: config.get("recaptcha.secret-key"),
                        response: recaptchaToken,
                    },
                }
            );

            if (!recaptchaResponse.data.success) {
                return response({
                    res,
                    code: 400,
                    message: "reCAPTCHA verification failed!",
                });
            }

            const userExists = await User.findOne({
                $or: [{ username }, { email }],
            });
            if (userExists) {
                return response({
                    res,
                    message: "User already exists!",
                    code: 400,
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            });
            await newUser.save();

            return response({
                res,
                message: "User registered successfully.",
                code: 201,
            });
        } catch (error) {
            console.log("Error while registering:", error);
            display_error(res);
        }
    }

    async login(req, res) {
        try {
            const { username, password, recaptchaToken } = req.body;

            const recaptchaResponse = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify`,
                null,
                {
                    params: {
                        secret: config.get("recaptcha.secret-key"),
                        response: recaptchaToken,
                    },
                }
            );

            if (!recaptchaResponse.data.success) {
                return response({
                    res,
                    code: 400,
                    message: "reCAPTCHA verification failed",
                });
            }

            const user = await User.findOne({
                $or: [{ username }, { email: username }],
            });
            if (!user) {
                return response({
                    res,
                    code: 400,
                    message: "Invalid credentials!",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return response({
                    res,
                    code: 400,
                    message: "Invalid credentials!",
                });
            }

            const token = jwt.sign({ id: user._id }, config.get("jwt_key"), {
                expiresIn: 3600,
            });

            user.tokens.push(token);
            await user.save();

            return response({
                res,
                message: "",
                data: {
                    username: user.username,
                    email: user.email,
                    token,
                },
            });
        } catch (error) {
            console.error("Error while logging in:", error);
            display_error(res);
        }
    }

    async forget_Password(req, res) {
        try {
            const { email, recaptchaToken } = req.body;

            const recaptchaResponse = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify`,
                null,
                {
                    params: {
                        secret: config.get("recaptcha.secret-key"),
                        response: recaptchaToken,
                    },
                }
            );

            if (!recaptchaResponse.data.success) {
                return response({
                    res,
                    code: 400,
                    message: "reCAPTCHA verification failed",
                });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return response({
                    res,
                    code: 200,
                    message:
                        "If an account with that email exists, a reset link has been sent.",
                });
            }

            const token = generate_Token(toString(Date.now()));

            const resetLink = `http://localhost:3000/api/auth/reset-password?token=${token}`;

            user.passwordResetToken = token;
            user.passwordResetTokenExpires = Date.now() + 3600000;

            const mailOptions = {
                from: config.get("smtp.email"),
                to: user.email,
                subject: "Password Reset",
                text: `Click on the following link to reset your password: ${resetLink}`,
                html: `<p>Click on the following link to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Failed to send reset-password link:", error);
                }
            });

            await user.save();

            return response({
                res,
                code: 200,
                message:
                    "If an account with that email exists, a reset link has been sent.",
            });
        } catch (error) {
            console.log("Error while sending forget-password link:", error);
            display_error(res);
        }
    }

    async reset_Password_Redirect(req, res) {
        try {
            const token = req.query.token;

            if (!token) {
                return response({
                    res,
                    code: 400,
                    message: "Token is required!",
                });
            }

            const user = await User.findOne({
                passwordResetToken: token,
            });

            if (!user) {
                return response({
                    res,
                    code: 400,
                    message: "Token is invalid or expired!",
                });
            }

            res.redirect(`http://localhost:3000/reset-password?token=${token}`);
        } catch (error) {
            console.log("Error while redirecting:", error);
            display_error(res);
        }
    }

    async reset_Password(req, res) {
        try {
            const { token, newPassword } = req.body;

            const user = await User.findOne({
                passwordResetToken: token,
                passwordResetTokenExpires: { $gt: Date.now() },
            });

            if (!user) {
                return response({
                    res,
                    code: 400,
                    message: "Token is invalidggggg or expired!",
                });
            }

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(newPassword, salt);
            user.passwordResetToken = null;
            user.passwordResetTokenExpires = null;

            await user.save();

            return response({
                res,
                code: 200,
                message: "Password updated!",
            });
        } catch (error) {
            console.log("Error while reseting password:", error);
            display_error(res);
        }
    }
}

module.exports = new AuthController();
