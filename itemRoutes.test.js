process.env.NODE_ENV = "test";
const app = require("./app"), fakeDb = require("./fakeDb"), request = require("supertest");

beforeEach(() => fakeDb.push({ name: "Apple", price: 2.52 }));

afterEach(() => fakeDb.length = 0);

describe("GET /items", () => {
    test("gets a full list of the shopping cart", async () => {
        const resp = await request(app).get("/items");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(fakeDb);
    })
})

describe("GET /items:name", () => {
    test("gets a singular item from the shopping cart", async () => {
        const resp = await request(app).get("/items/Apple");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({name: "Apple", price: 2.52});
    })

    test("responds with 404 if the item does not exist", async () => {
        const resp = await request(app).get("/items/Watermelon");
        expect(resp.statusCode).toBe(404);
    })
})

describe("POST /items", () => {
    test("posts a new item into the cart", async () => {
        const newItem = { name: "Banana", price: 1.25 }, resp = await request(app).post("/items").send(newItem);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({ added: newItem });
    })

    test("responds with 406 if parameter is missing or invalid", async () => {
        const newInvalidItem = {name:false, cash:2.50}, resp = await request(app).post("/items").send(newInvalidItem) //name is invalid while price is missing
        expect(resp.statusCode).toBe(406);
    })
})

describe("PATCH /items:name", () => {
    test("patches an existing item / the ability to edit an existing item", async () => {
        const editItem = {name: "Pear", price: 1.65}, resp = await request(app).patch("/items/Apple").send(editItem); //edits the item
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({updated: editItem});
    })

    test("responds with 404 if the item does not exist", async () => {
        const editItem = {name: "Pear", price: 1.65}, resp = await request(app).patch("/items/Nonexistent").send(editItem); //attempting edit an item, but it doesn't exist, so it shouldn't work and instead should return a 406.
        expect(resp.statusCode).toBe(404);
    })
})

describe("DELETE /items:name", () => {
    test("deletes an existing item / the ability to delete an item", async () => {
        const resp = await request(app).delete("/items/Apple");
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({message: "Deleted"})
    })

    test("responds with 406 if the item does not exist.", async () =>{
        const resp = await request(app).delete("/items/Nothing");
        expect(resp.statusCode).toBe(404);
    })
})