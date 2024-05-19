const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function isLoggined(req, res, next, auth = true) {
    const token = req.header("x-auth-token");

    if (auth) {
        if (!token) {
            return res.status(401).send("Access Denied");
        }
        await handleToken(req, res, token);
    } else {
        if (token) {
            await handleToken(req, res, token);
        }
    }

    next();
}

async function handleToken(req, res, token) {
    try {
        const decoded = jwt.verify(token, "xice_team");
        const user = await User.findById(decoded.id);
        if (!user.tokens.includes(token)) {
            return res.status(400).send("Invalid token");
        }

        if (!user.isActive) {
            return res
                .status(401)
                .send("You are banned! Please contact with admin!");
        }

        req.user = user;
    } catch {
        res.status(400).send("invalid token");
    }
}

async function redirectAdmin(req, res, next) {
    if (req.url === "/") {
        return res.redirect("http://localhost:8000/api/admin/me");
    }
    next();
}

async function redirectUser(req, res, next) {
    if (req.url === "/") {
        return res.redirect("http://localhost:8000/api/user/me");
    }
    next();
}

async function isAdmin(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).send("Access denied");
    }

    try {
        const decoded = jwt.verify(token, "xice_team");
        const user = await User.findById(decoded._id);

        if (!user.isAdmin) {
            return res.status(403).send("Access denied. User is not an admin.");
        }
        req.user = user;
        next();
    } catch (ex) {
        res.status(400).send("invalid token");
    }
}

module.exports = {
    isLoggined,
    isAdmin,
    redirectAdmin,
    redirectUser,
};
