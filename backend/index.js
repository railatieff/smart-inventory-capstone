/**
 * Main server file for the Smart Inventory application.
 * This file is now a PURE API backend. It does not serve any HTML.
 * It initializes Express, sets up CORS, defines API endpoints,
 * and connects to the database and AI service.
 */

// --- 1. Imports ---
const express = require("express");
const cors = require("cors"); // For Cross-Origin Resource Sharing
const db = require("./db");
const aiService = require("./aiService");
const app = express();
const port = process.env.PORT || 3000;

// --- 2. Middleware Setup ---

// Enable CORS for all routes (allows Vercel frontend to call this API)
app.use(cors());

// Standard middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Note: We no longer serve static files (like index.html) from this backend.

// --- 3. Database Initialization ---
/**
 * Runs once on server startup to ensure the 'products' table exists.
 */
async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      attributes TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await db.query(createTableQuery);
    console.log('"products" table was successfully checked/created.');
  } catch (err) {
    console.error("Error creating database table:", err.stack);
  }
}

// --- 4. API Endpoints (CRUD) ---

/**
 * [C]REATE: Add a new product.
 * Route: POST /api/products
 * Body: { "name": "...", "attributes": "..." }
 */
app.post("/api/products", async (req, res) => {
  try {
    const { name, attributes } = req.body;
    if (!name || !attributes) {
      return res
        .status(400)
        .json({ error: "Name and attributes are required" });
    }
    const newProduct = await db.query(
      "INSERT INTO products (name, attributes) VALUES ($1, $2) RETURNING *",
      [name, attributes]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * [R]EAD: Get all products, ordered by newest first.
 * Route: GET /api/products
 */
app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await db.query(
      "SELECT * FROM products ORDER BY id DESC"
    );
    res.json(allProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * [R]EAD: Get a single product by its ID.
 * Route: GET /api/products/:id
 */
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product.rows[0]); // Send the single product object
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * [U]PDATE: Update a product (e.g., add AI description).
 * Route: PUT /api/products/:id
 * Body: { "description": "..." }
 */
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateProduct = await db.query(
      "UPDATE products SET description = $1 WHERE id = $2 RETURNING *",
      [description, id]
    );
    if (updateProduct.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updateProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * [D]ELETE: Delete a product by ID.
 * Route: DELETE /api/products/:id
 */
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await db.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (deleteProduct.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product successfully deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- 5. AI API Endpoint ---

/**
 * [AI] GENERATE: Trigger AI description generation for a product.
 * Route: POST /api/products/:id/generate-description
 */
app.post("/api/products/:id/generate-description", async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Get product info from DB
    const productResult = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const product = productResult.rows[0];

    // 2. Call the AI Service
    console.log(`[API] Calling AI Service for product: ${product.name}`);
    const description = await aiService.generateDescription(
      product.name,
      product.attributes
    );

    // 3. Save the new description back to the DB
    const updateProduct = await db.query(
      "UPDATE products SET description = $1 WHERE id = $2 RETURNING *",
      [description, id]
    );

    // 4. Send the updated product back to the frontend
    res.json(updateProduct.rows[0]);
  } catch (err) {
    // Pass the specific error message from the AI Service (or DB) to the frontend
    console.error(`[API] Error generating description: ${err.message}`);
    res.status(500).json({
      error: err.message || "Server Error: Failed to generate description",
    });
  }
});

// --- 6. Start Server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  // Initialize the database table once the server is ready
  initializeDatabase();
});
