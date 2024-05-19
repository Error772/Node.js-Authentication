const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const router = require("../src/routes");

// Import the database connection function
const connectToDatabase = require("../startup/db");

// Use the actual database connection function to connect to the database
beforeAll(async () => {
    await connectToDatabase(mongoose);
});

app.use(express.json());
app.use("/api", router);

describe('API Endpoints', () => {
    // Test case for /api/auth/register endpoint

    // *Note that you must not have registered user with these specifications!

    it('should register a new user on POST /api/auth/register', async () => {
        const userData = { username: 'testuser', email:"test@example.com", password: 'testpassword' };
        const response = await request(app)
            .post('/api/auth/register')
            .send(userData);

        expect(response.status).toBe(201);
    });

    // Test case for /api/auth/login endpoint
    it('should login an existing user on POST /api/auth/login', async () => {
        const credentials = { email: 'test@example.com', password: 'testpassword' };
        const response = await request(app)
            .post('/api/auth/login')
            .send(credentials);

        expect(response.status).toBe(200);
    });
});


describe("Server Functionality", () => {
    // Test case for checking if the server responds with status 404 for a non-existing path
    it("should respond with status 404 for a non-existing path", async () => {
        const response = await request(app).get("/non-existing-path");
        expect(response.status).toBe(404);
    });
});

describe("Database Connection", () => {
    // Test case for checking if the database connection is established successfully
    it("should connect to the database", async () => {
        // Assuming that your connectToDatabase function returns a Promise
        // You can adjust this based on your actual implementation
        await expect(connectToDatabase(mongoose)).resolves.not.toThrow();
    });
});

// With this setup, the MongoDB connection will be closed after all tests have completed, ensuring that there are no open handles and Jest can exit properly.
afterAll(async () => {
    await mongoose.disconnect();
});
