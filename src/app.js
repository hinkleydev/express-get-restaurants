const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");

// All restaurants
app.get("/restaurants", async function(req, res) {
    const restaurants = await Restaurant.findAll();
    const result = JSON.stringify(restaurants)
    res.send(result);
})

// Specific restaurants
app.get("/restaurants/:id", async function(req, res) {
    const restaraunt = await Restaurant.findByPk(req.params.id);
    const result = JSON.stringify(restaraunt);
    res.send(result);
})


module.exports = app;