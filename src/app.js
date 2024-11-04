const express = require("express");
const app = express();
const restaurantRoute = require("../routes/restaurant");

// Middleware

app.use("/", restaurantRoute);

module.exports = app;