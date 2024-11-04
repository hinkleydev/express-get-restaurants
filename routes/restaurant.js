const express = require("express");
const restaurantRoute = express.Router();
const Restaurant = require("../models/index");
const bodyParser = require("body-parser");

// Middleware
restaurantRoute.use(express.json());
restaurantRoute.use(express.urlencoded());

// All restaurants
restaurantRoute.get("/restaurants", async function(req, res) {
    const restaurants = await Restaurant.findAll();
    const result = JSON.stringify(restaurants)
    res.send(result);
})

// Specific restaurants
restaurantRoute.get("/restaurants/:id", async function(req, res) {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant == null) {
        res.send("Restaurant not found");
        return;
    }
    const result = JSON.stringify(restaurant);
    res.send(result);
})

// Add new restaurant
restaurantRoute.post("/restaurants", async function(req, res) {
    const name = req.body.name;
    const location = req.body.location;
    const cuisine = req.body.cuisine;
    const restaurant = await Restaurant.create({name, location, cuisine});
    const allRestaurants = await Restaurant.findAll();
    res.send(allRestaurants);
})

// Change restaurant
restaurantRoute.post("/restaurants/:id", async function(req, res) {
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
restaurantRoute.delete("/restaurants/:id", async function(req, res) {
    let restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant == null) {
        res.send("Restaurant not found");
        return;
    }
    await restaurant.destroy();
    res.send("Deleted");
})

module.exports = restaurantRoute;