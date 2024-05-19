const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { response } = require("../controller");

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

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
            res.status(500).json("Internal Server Error.");
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({
                $or: [{ username }, { email: username }],
            });
            if (!user) {
                return response({
                    res,
                    message: "Invalid credentials!1",
                    code: 400,
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return response({
                    res,
                    message: "Invalid credentials!",
                    code: 400,
                });
            }

            const token = jwt.sign({ id: user._id }, "xice_team", {
                expiresIn: 3600,
            });

            user.tokens.push(token);
            await user.save();

            return response({
                res,
                message: "",
                code: 200,
                data: {
                    username: user.username,
                    email: user.email,
                    token,
                },
            });
        } catch (error) {
            console.log("Error while logging in:", error);
            res.status(500).json("Internal Server Error.");
        }
    }
}

module.exports = new AuthController();
