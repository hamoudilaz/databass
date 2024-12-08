import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import Product from "../models/ProductSchema.js";

beforeEach(async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductsDb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.insertMany([
      {
        name: "The Hobbit",
        description: "Fantasy book",
        isbn: "12345",
        price: 150,
        category: "Fantasy",
      },
      {
        name: "1984",
        description: "Dystopian book",
        isbn: "67890",
        price: 200,
        category: "Dystopian",
      },
    ]);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Product API Tests", () => {
  test("GET /api/products - should fetch all products", async () => {
    const resp = await request(app).get("/api/products");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBe(2);
  });

  test("POST /api/products - should create a new product", async () => {
    const newProduct = {
      name: "The Catcher in the Rye",
      description: "Classic literature",
      isbn: "13579",
      price: 120,
      category: "Classic",
    };

    const resp = await request(app).post("/api/products").send(newProduct);
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toHaveProperty("_id");
    expect(resp.body.name).toBe("The Catcher in the Rye");
  });

  test("GET /api/products/:id - should fetch a product by ID", async () => {
    const product = await Product.findOne({ name: "The Hobbit" });
    const resp = await request(app).get(`/api/products/${product._id}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.name).toBe("The Hobbit");
  });

  test("PUT /api/products/:id - should update a product", async () => {
    const product = await Product.findOne({ name: "1984" });
    const resp = await request(app).put(`/api/products/${product._id}`).send({
      price: 250,
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.price).toBe(250);
  });

  test("DELETE /api/products/:id - should delete a product", async () => {
    const product = await Product.findOne({ name: "The Hobbit" });
    const resp = await request(app).delete(`/api/products/${product._id}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.message).toBe("Product deleted successfully");
  });
});
