const expressValidator = require("express-validator");
const { validationResult } = require("express-validator");
const { check } = expressValidator;

function validationBody(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.array();
        const messages = [];
        errors.forEach((err) => messages.push(err.msg));
        res.status(400).json({
            message: "validation error",
            data: messages,
        });
        return false;
    }
    return true;
}

function validate(req, res, next) {
    if (!validationBody(req, res)) {
        return;
    }
    next();
}

//====================[Auth]====================\\

function registerValidator() {
    return [
        validate,
        check("username").not().isEmpty().withMessage("username cant be empty"),
        check("email").isEmail().withMessage("invalid email"),
        check("password").not().isEmpty().withMessage("password cant be empty"),
        checkForRequiredAndExtraParameters(["username", "email", "password"]),
    ];
}

function loginValidator() {
    return [
        validate,
        check("username").not().isEmpty().withMessage("username cant be empty"),
        check("password").not().isEmpty().withMessage("password cant be empty"),
        checkForRequiredAndExtraParameters(["username", "password"]),
    ];
}

function passValidator() {
    return [
        validate,
        check("password").not().isEmpty().withMessage("password cant be empty"),
        checkForRequiredAndExtraParameters(["password"]),
    ];
}

function checkForRequiredAndExtraParameters(requiredParams) {
    return (req, res, next) => {
        const missingParams = requiredParams.filter(
            (param) => !req.body.hasOwnProperty(param)
        );
        const unexpectedParams = Object.keys(req.body).filter(
            (param) => !requiredParams.includes(param)
        );

        if (unexpectedParams.length > 0) {
            return res.status(400).json({
                error: `Unexpected parameters: ${unexpectedParams.join(", ")}`,
            });
        } else if (missingParams.length > 0) {
            return res.status(400).json({
                error: `Missing parameters: ${missingParams.join(", ")}`,
            });
        }

        next();
    };
}

module.exports = {
    registerValidator,
    loginValidator,
    passValidator,
};
