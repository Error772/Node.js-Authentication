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
        check("recaptchaToken")
            .not()
            .isEmpty()
            .withMessage("recaptchaToken cant be empty"),
        checkForRequiredAndExtraParameters([
            "username",
            "email",
            "password",
            "recaptchaToken",
        ]),
    ];
}

function loginValidator() {
    return [
        validate,
        check("username").not().isEmpty().withMessage("username cant be empty"),
        check("password").not().isEmpty().withMessage("password cant be empty"),
        check("recaptchaToken")
            .not()
            .isEmpty()
            .withMessage("recaptchaToken cant be empty"),
        checkForRequiredAndExtraParameters([
            "username",
            "password",
            "recaptchaToken",
        ]),
    ];
}

function passValidator() {
    return [
        validate,
        check("password").not().isEmpty().withMessage("password cant be empty"),
        checkForRequiredAndExtraParameters(["password"]),
    ];
}

function forgetValidator() {
    return [
        validate,
        check("email").not().isEmpty().withMessage("email cant be empty"),
        check("recaptchaToken")
            .not()
            .isEmpty()
            .withMessage("recaptchaToken cant be empty"),
        checkForRequiredAndExtraParameters(["email", "recaptchaToken"]),
    ];
}

function reset_PassValidator() {
    return [
        validate,
        check("newPassword").not().isEmpty().withMessage("newPassword cant be empty"),
        check("token").not().isEmpty().withMessage("token cant be empty"),
        checkForRequiredAndExtraParameters(["newPassword", "token"]),
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
    forgetValidator,
    reset_PassValidator,
};
