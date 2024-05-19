module.exports = async function (mongoose) {
    try {
        await mongoose.connect("mongodb://localhost:27017/login");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
    }
};
