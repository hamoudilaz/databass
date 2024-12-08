import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/ProductSchema.js";

dotenv.config();

beforeEach(async () => {
  try {
    // Connect to the database using the connection string from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    Product.deleteMany();
    await Product.insertMany([
      {
        name: "The Hobbit",
        description: "Fantasy book",
        isbn: "12345",
        price: 150,
        quantity: 10,
        category: "Fantasy",
      },
      {
        name: "1984",
        description: "Dystopian book",
        isbn: "67890",
        price: 200,
        quantity: 5,
        category: "Dystopian",
      },
    ]);
  } catch (err) {
    console.error("Error in beforeEach:", err);
    process.exit(1);
  }
});

afterEach(async () => {
  // Clean up the database and disconnect
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

  test("GET /api/products/search - should fetch products based on a query", async () => {
    const resp = await request(app).get("/api/products/search?price=0");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBeGreaterThanOrEqual(0);
  });

  test("DELETE /api/products - should delete all products", async () => {
    const resp = await request(app).delete("/api/products");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.message).toBe("All products have been deleted");

    const products = await Product.find();
    expect(products.length).toBe(0);
  });

  test("GET / - should fetch HTML with product list", async () => {
    const resp = await request(app).get("/");
    expect(resp.statusCode).toBe(200);
    expect(resp.text).toContain("Product List");
    expect(resp.text).toContain("The Hobbit");
    expect(resp.text).toContain("1984");
  });
});
