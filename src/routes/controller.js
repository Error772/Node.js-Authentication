module.exports = class {
    static response({ res, message, code = 200, data = {} }) {
        res.status(code).json({
            message,
            data,
        });
    }

    static display_error(res) {
        return this.response({
            res,
            code: 500,
            message: "Internal Server Error.",
        });
    }
};
