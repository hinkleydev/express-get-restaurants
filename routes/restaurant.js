const express = require("express");
const restaurantRoute = express.Router();
const Restaurant = require("../models/index");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

/** All of these chains perform the exact same operation on seperate variables
 *  check it's not empty -> trim it down
 *  They're seperated for readability
 */
const checkName = () => check("name").not().isEmpty().trim();
const checkLocation = () => check("location").not().isEmpty().trim();
const checkCuisine = () => check("cuisine").not().isEmpty().trim();

// This chain checks the length is more than 10 and less than 30
const checkNameLength = () => check("name").isByteLength({min: 10, max: 30});

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
restaurantRoute.post("/restaurants", 
    [checkName(), checkNameLength(), checkLocation(), checkCuisine()], // Validators 
    async function(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({error})
        return;
    }
    const name = req.body.name;
    const location = req.body.location;
    const cuisine = req.body.cuisine;
    await Restaurant.create({name, location, cuisine});
    const allRestaurants = await Restaurant.findAll();
    res.json(allRestaurants);
})

// Change restaurant
restaurantRoute.put("/restaurants/:id", 
    [checkName(), checkNameLength(), checkLocation(), checkCuisine()], // Validators 
    async function(req, res) {
        const error = validationResult(req);
            if (!error.isEmpty()) {
                res.status(400).json({error})
                return;
            }
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