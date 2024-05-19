module.exports = class {
    static response({ res, message, code = 200, data = {} }) {
        res.status(code).json({
            message,
            data,
        });
    }
};
