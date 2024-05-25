const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

require("./startup/db")(mongoose);

const router = require("./src/routes");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "public", "login.html"))
);

app.get("/login", (req, res) =>
    res.sendFile(path.join(__dirname, "public", "login.html"))
);

app.get("/register", (req, res) =>
    res.sendFile(path.join(__dirname, "public", "register.html"))
);

app.get("/forget", (req, res) =>
    res.sendFile(path.join(__dirname, "public", "forget-password.html"))
);

app.get("/reset-password", (req, res) =>
    res.sendFile(path.join(__dirname, "public", "reset-password.html"))
);

app.get("/panel", (req, res) =>
    res.sendFile(path.join(__dirname, "public", "panel.html"))
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
