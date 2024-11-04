const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");
const { EmptyResultError } = require("sequelize");

// Middleware
app.use(express.json());
app.use(express.urlencoded());

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

// Add new restaurant
app.post("/restaurants", async function(req, res) {
    const name = req.body.name;
    const location = req.body.location;
    const cuisine = req.body.cuisine;
    const restaurant = Restaurant.create({name, location, cuisine});
    const result = JSON.stringify(restaurant);
    res.send("Added!");
})


module.exports = app;