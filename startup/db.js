const config = require("config");

module.exports = async function (mongoose) {
    try {
        await mongoose.connect(config.get("db.address"));
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
    }
};
