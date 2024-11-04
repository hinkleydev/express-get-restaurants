const { it, describe, expect } = require("@jest/globals");
const Restaurant = require("../models");
const baseUrl = "http://localhost:3000/restaurants";

describe("GET /restaurants", function() {
    it("responds 200", async function() {
        const response = await fetch(baseUrl);
        expect(response.status).toBe(200);
    })

    it("returns an array of restaurants", async function() {
        const response = await fetch(baseUrl)
        const parsed = await response.json();
        for(line of parsed) {
            // Flick through each object and check it has the fields
            expect(line).toHaveProperty("name");
            expect(line).toHaveProperty("cuisine");
            expect(line).toHaveProperty("location");
        }
    })

    it("returns the correct amount of restaurants", async function() {
        // Get the right number to check for
        const restaurants = await Restaurant.findAll();
        const correctAmount = restaurants.length;
        const response = await fetch(baseUrl)
        const parsed = await response.json();
        expect(parsed.length).toBe(correctAmount);
    })

    it("returns the correct restaurant data", async function() {
        // Example data
        const restaurants = await Restaurant.findAll();
        const response = await fetch(baseUrl);
        const parsed = await response.json();
        for(index in restaurants) {
            // Object comparison
            expect(parsed[index]).toEqual(parsed[index]);
        }
    })
})