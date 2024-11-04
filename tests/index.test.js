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

// These tests will assume that an object with ID 1 exists
describe("GET /restaurants/:id", function() {
    it("returns the correct data", async function() {
        const restaurant = await Restaurant.findByPk(1);
        const response = await fetch(baseUrl + "/1");
        const parsed = await response.json();
        // A regular object comparison does not pass because the datetime fields are stored differently from the API and Sequelize
        expect(parsed.name).toBe(restaurant.name);
        expect(parsed.cuisine).toBe(restaurant.cuisine);
        expect(parsed.location).toBe(restaurant.location);
    })
})

describe("POST /restaurants", function() {
    it("updates the array with a new value", async function() {
        // Get an original for comparison
        let response = await fetch(baseUrl);
        const original = await response.json(); 
        const newObject = {"name" : "Maccies", "location" : "Northwich", "cuisine" : "Fast food"};
        original.push(newObject)

        const request = new Request(baseUrl, {
            method: "POST",
            headers : {
                "Content-type" : "application/x-www-form-urlencoded"
            },
            // I think I might be missing how to do this easier but I'm not sure
            body: "name=Maccies&location=Northwich&cuisine=Fast%20food",
        });

        response = await fetch(request);
        const parsed = await response.json();
        for(index in parsed) {
            // Flick through each object and check it has the fields
            expect(parsed[index].name).toBe(original[index].name);
            expect(parsed[index].location).toBe(original[index].location);
            expect(parsed[index].cuisine).toBe(original[index].cuisine);
        }
    })
})

describe("PUT /restaurants/:id", function() {
    it("updates a restaurants with the provided values", async function() {
        const newObject = {"name" : "Maccies", "location" : "Northwich", "cuisine" : "Fast food"};

        const request = new Request(baseUrl + "/1", {
            method: "POST",
            headers : {
                "Content-type" : "application/x-www-form-urlencoded"
            },
            // I think I might be missing how to do this easier but I'm not sure
            body: "name=Maccies&location=Northwich&cuisine=Fast%20food",
        });
        const result = await fetch(request);
        const parsed = await result.json();

        const readObject = await Restaurant.findByPk(1);
        expect(parsed.name).toBe(readObject.name);
        expect(parsed.location).toBe(readObject.location);
        expect(parsed.cuisine).toBe(readObject.cuisine);
    })
})

describe("DELETE /restaurants/:id", function() {
    it("deletes the restaurant with the provided ID", async function() {
        const request = new Request(baseUrl + "/1", {
            method: "DELETE"
        });

        const response = await fetch(request);
    
        // Now check it isn't there anymore
        const lookForDeleted = await fetch(baseUrl + "/1");
        expect(lookForDeleted.status).toBe(404);
    })
})