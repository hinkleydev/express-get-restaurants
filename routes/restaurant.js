const express = require("express");
const restaurantRoute = express.Router();
const Restaurant = require("../models/index");
const bodyParser = require("body-parser");

// All restaurants
restaurantRoute.get("/restaurants", async function(req, res) {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
})

// Specific restaurants
restaurantRoute.get("/restaurants/:id", async function(req, res) {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant == null) {
        res.status(404).send({error: "Restaurant not found"});
        return;
    }
    res.json(restaurant);
})

// Add new restaurant
restaurantRoute.post("/restaurants", async function(req, res) {
    const name = req.body.name;
    const location = req.body.location;
    const cuisine = req.body.cuisine;
    const restaurant = await Restaurant.create({name, location, cuisine});
    const allRestaurants = await Restaurant.findAll();
    res.json(allRestaurants);
})

// Change restaurant
restaurantRoute.put("/restaurants/:id", async function(req, res) {
    const name = req.body.name;
    const location = req.body.location;
    const cuisine = req.body.cuisine;
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant == null) {
        res.status(404).send({error: "Restaurant not found"});
        return;
    }
    await restaurant.update({name, location, cuisine});
    res.json(restaurant);
})

// Delete restaurant
restaurantRoute.delete("/restaurants/:id", async function(req, res) {
    let restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant == null) {
        res.status(404).send({error: "Restaurant not found"});
        return;
    }
    await restaurant.destroy();
    res.json({message: "Deleted"});
})

module.exports = restaurantRoute;