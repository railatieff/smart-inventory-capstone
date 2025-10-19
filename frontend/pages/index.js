import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link"; // Used to link to the detail page

// Define the Backend API URL (read from environment variables)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Home Page (index.js)
 * This is the main page of the application.
 * It allows users to add new products and displays a list of all existing products.
 * Each product in the list links to its own dynamic detail page.
 */
export default function Home() {
  // --- 1. State Management ---
  const [products, setProducts] = useState([]); // Holds the list of all products
  const [isLoading, setIsLoading] = useState(true); // Main page loading state
  const [error, setError] = useState(null); // For fetch errors

  // State for the new product form
  const [formName, setFormName] = useState("");
  const [formAttributes, setFormAttributes] = useState("");

  // --- 2. Data Fetching ---
  /**
   * Fetches all products from the API when the component first mounts.
   */
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Async function to fetch all products from the backend API
   * and update the component's state.
   */
  async function fetchProducts() {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // --- 3. Event Handlers ---
  /**
   * Handles the submission of the "Add Product" form.
   * Sends a POST request to the backend and refreshes the product list.
   */
  const handleAddProduct = async (e) => {
    e.preventDefault(); // Prevent full page reload
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, attributes: formAttributes }),
      });
      if (!response.ok) throw new Error("Failed to add product");

      // Reset form fields and refresh the product list
      setFormName("");
      setFormAttributes("");
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- 4. Render Logic ---
  return (
    <>
      <Head>
        <title>Smart Inventory - Granite AI</title>
      </Head>

      <main className="container">
        <nav>
          <ul>
            <li>
              <strong>Smart Inventory 📦</strong>
            </li>
          </ul>
          <ul>
            <li>IBM Granite Capstone Project</li>
          </ul>
        </nav>

        <h1>Product Management</h1>

        {/* Product addition form */}
        <form onSubmit={handleAddProduct}>
          <div className="grid">
            <label htmlFor="name">
              Product Name
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g., Stussy 8-Ball Tee"
                required
                value={formName} // Controlled component
                onChange={(e) => setFormName(e.target.value)}
              />
            </label>
            <label htmlFor="attributes">
              Attributes / Keywords
              <input
                type="text"
                id="attributes"
                name="attributes"
                placeholder="e.g., Cotton, Black, Size L, Streetwear, Hypebeast"
                required
                value={formAttributes} // Controlled component
                onChange={(e) => setFormAttributes(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Add Product</button>
        </form>

        <hr />

        {/* Global loading/error indicators */}
        {isLoading && <progress></progress>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Product list section */}
        <h2>Product List</h2>
        <div id="product-list-links">
          {/* Show message if list is empty and not loading */}
          {!isLoading && products.length === 0 && (
            <p>No products yet. Please add one.</p>
          )}

          {/* Map over products and render a link-card for each */}
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <Link
                href={`/products/${product.id}`} // Dynamic link to the detail page
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <header>
                  <h3>{product.name}</h3>
                  <p style={{ margin: 0 }}>View Details →</p>
                </header>
                <p className="attributes" style={{ margin: 0 }}>
                  <b>Attributes:</b> {product.attributes}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
