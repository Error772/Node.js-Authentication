const { response, display_error } = require("../controller");
class UserController {
    async me(req, res) {
        try {
            const user = req.user;

            return response({
                res,
                message: "",
                code: 200,
                data: {
                    username: user.username,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error("Error while getting user info:", error);
            display_error(res);
        }
    }

    async logout(req, res) {
        try {
            const user = req.user;
            const token = req.header("x-auth-token");

            const index = user.tokens.indexOf(token);

            user.tokens.splice(index, 1);
            await user.save();
            return response({
                res,
                code: 200,
                message: "Logged out successfully",
            });
        } catch (error) {
            console.log("Error while logging out:", error);
            display_error(res);
        }
    }
}

module.exports = new UserController();
