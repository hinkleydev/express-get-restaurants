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
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant == null) {
        res.send("Restaurant not found");
        return;
    }
    const result = JSON.stringify(restaurant);
    res.send(result);
})

// Add new restaurant
app.put("/restaurants", async function(req, res) {
    const name = req.body.name;
    const location = req.body.location;
    const cuisine = req.body.cuisine;
    const restaurant = await Restaurant.create({name, location, cuisine});
    res.send(restaurant);
})

// Change restaurant
app.post("/restaurants/:id", async function(req, res) {
    const name = req.body.name;
    const location = req.body.location;
    const cuisine = req.body.cuisine;
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant == null) {
        res.send("Restaurant not found");
        return;
    }
    await restaurant.update({name, location, cuisine});
    res.send(restaurant);
})

// Delete restaurant
app.delete("/restaurants/:id", async function(req, res) {
    let restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant == null) {
        res.send("Restaurant not found");
        return;
    }
    await restaurant.destroy();
    res.send("Deleted");
})


module.exports = app;