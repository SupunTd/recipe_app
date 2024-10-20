
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// Middlewares
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

app.use(express.static("uploads"));

// Database connection
const connectionParams = {};

try {
    mongoose.connect("mongodb+srv://supunthilakshana11:admin@cluster0.0rooy.mongodb.net" +
        "/?retryWrites=true&w=majority&appName=Cluster0", connectionParams);
    console.log("Connected to the database successfully");
} catch (error) {
    console.log(error);
    console.log("Could not connect to the database!");
}

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const favoritesRouter = require("./routes/favorites");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoritesRouter);

const port = process.env.PORT || 5000;  // (||-logical or operation)
app.listen(port, () => console.log(`Listening on port ${port}...`));
