import { Router } from "express";
import Product from "../models/ProductSchema.js";

const router = new Router();

router.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Söker
router.get("/api/products/search", async (req, res) => {
  try {
    const priceFilter = req.query.price || 0;
    const products = await Product.find({
      price: { $gt: priceFilter },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Product not found" });
  }
});

router.post("/api/products", async (req, res) => {
  try {
    const addProduct = new Product(req.body);
    await addProduct.save();
    res.status(201).json(addProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/api/products", async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    res.status(200).json({
      message: `All products have been deleted`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/api/products/:id", async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        overwrite: true,
      }
    );
    if (!updateProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/api/products/:id", async (req, res) => {
  try {
    const removeProduct = await Product.findByIdAndDelete(req.params.id);
    if (!removeProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title style="text-align: center;">Product List</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px;
            border: 1px solid #ccc;
          }
          th {
            background-color: #f4f4f4;
          }
        </style>
      </head>
      <body>
        <h1>Product List</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
                <th>Category</th>
            </tr>
          </thead>
          <tbody>
    `;

    products.forEach((product) => {
      html += `
        <tr>
          <td>${product.name}</td>
          <td>${product.description}</td>
          <td>${product.price}</td>
          <td>${product.quantity || "Unknown"}</td>
          <td>${product.category}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
});

export default router;
