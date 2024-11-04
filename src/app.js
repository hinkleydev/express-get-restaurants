const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");

//TODO: Create your GET Request Route Below: 
app.get("/restaurants", async function(req, res) {
    const restaurants = await Restaurant.findAll();
    const result = JSON.stringify(restaurants)
    res.send(result);
})



module.exports = app;