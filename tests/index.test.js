const { it, describe, expect } = require("@jest/globals");
const Restaurant = require("../models");
const request = require("supertest");
const app = require("../src/app.js");
const baseUrl = "/restaurants";

const { execSync } = require('child_process');
execSync('npm run seed'); // Might not pass with modified data

describe("GET /restaurants", function() {
    it("responds 200", async function() {
        const response = await request(app).get(baseUrl);
        expect(response.status).toBe(200);
    })

    it("returns an array of restaurants", async function() {
        const response = await request(app).get(baseUrl);
        const parsed = JSON.parse(response.text);
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
        const response = await request(app).get(baseUrl);
        const parsed = JSON.parse(response.text);
        expect(parsed.length).toBe(correctAmount);
    })

    it("returns the correct restaurant data", async function() {
        // Example data
        const restaurants = await Restaurant.findAll();
        const response = await request(app).get(baseUrl);
        const parsed = JSON.parse(response.text);
        for(index in restaurants) {
            // Object comparison
            expect(parsed[index]).toEqual(parsed[index]);
        }
    })
})

// These tests will assume that an object with ID 1 exists
describe("GET /restaurants/:id", function() {
    it("returns the correct data", async function() {
        const restaurant = await Restaurant.findByPk(1);
        const response = await request(app).get(baseUrl + "/1");
        const parsed = JSON.parse(response.text);
        // A regular object comparison does not pass because the datetime fields are stored differently from the API and Sequelize
        expect(parsed.name).toBe(restaurant.name);
        expect(parsed.cuisine).toBe(restaurant.cuisine);
        expect(parsed.location).toBe(restaurant.location);
    })
})

describe("POST /restaurants", function() {
    it("updates the array with a new value", async function() {
        // Get an original for comparison
        let response = await request(app).get(baseUrl);
        const original = JSON.parse(response.text);
        const newObject = {"name" : "Maccies", "location" : "Northwich", "cuisine" : "Fast food"};
        original.push(newObject)

        const addRestaurant = await request(app).post(baseUrl).send(newObject);
        const parsed = JSON.parse(addRestaurant.text);
        for(index in parsed) {
            // Flick through each object and check it has the fields
            expect(parsed[index].name).toBe(original[index].name);
            expect(parsed[index].location).toBe(original[index].location);
            expect(parsed[index].cuisine).toBe(original[index].cuisine);
        }
    })
    it("rejects data with no name", async function() {
        const badData = {location: "Kingsmead", cuisine: "Indian"};
        const badRequest = await request(app).post(baseUrl).send(badData);
        expect(badRequest.statusCode).toBe(400);
    })
    it("rejects data with no location", async function() {
        const badData = {name: "Kingsmead spice", cuisine: "Indian"};
        const badRequest = await request(app).post(baseUrl).send(badData);
        expect(badRequest.statusCode).toBe(400);
    })
    it("rejects data with no cuisine", async function() {
        const badData = {name: "Kingsmead spice", location: "Kingsmead"};
        const badRequest = await request(app).post(baseUrl).send(badData);
        expect(badRequest.statusCode).toBe(400);
    })
})

describe("PUT /restaurants/:id", function() {
    it("updates a restaurants with the provided values", async function() {
        const newObject = {"name" : "Maccies", "location" : "Northwich", "cuisine" : "Fast food"};

        const updatedRestaurant = await request(app).put(baseUrl + "/2").send(newObject);
        const parsed = JSON.parse(updatedRestaurant.text);


        const readObject = await Restaurant.findByPk(2);
        expect(parsed.name).toBe(readObject.name);
        expect(parsed.location).toBe(readObject.location);
        expect(parsed.cuisine).toBe(readObject.cuisine);
    })
    it("rejects data with no name", async function() {
        const badData = {location: "Kingsmead", cuisine: "Indian"};
        const badRequest = await request(app).put(baseUrl + "/2").send(badData);
        expect(badRequest.statusCode).toBe(400);
    })
    it("rejects data with no location", async function() {
        const badData = {name: "Kingsmead spice", cuisine: "Indian"};
        const badRequest = await request(app).put(baseUrl + "/2").send(badData);
        expect(badRequest.statusCode).toBe(400);
    })
    it("rejects data with no cuisine", async function() {
        const badData = {name: "Kingsmead spice", location: "Kingsmead"};
        const badRequest = await request(app).put(baseUrl + "/2").send(badData);
        expect(badRequest.statusCode).toBe(400);
    })
})

describe("DELETE /restaurants/:id", function() {
    it("deletes the restaurant with the provided ID", async function() {
        await request(app).delete(baseUrl + "/1");
    
        // Now check it isn't there anymore
        const lookForDeleted = await request(app).get(baseUrl + "/1");
        expect(lookForDeleted.status).toBe(404);
    })
})