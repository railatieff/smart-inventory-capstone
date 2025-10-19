import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

// Define the Backend API URL (read from environment variables)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * ProductDetail Page
 * This is a dynamic page that displays details for a single product.
 * It fetches data based on the [id] in the URL.
 */
export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query; // Get the product [id] from the URL query params

  // --- 1. State Management ---
  const [product, setProduct] = useState(null); // Stores the product data object
  const [isLoading, setIsLoading] = useState(true); // For loading indicators
  const [error, setError] = useState(null); // For handling fetch errors

  // --- 2. Data Fetching ---
  /**
   * Fetches data for a single product from the backend API.
   */
  async function fetchProduct() {
    if (!id) return; // Don't fetch if the router isn't ready and 'id' is undefined
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Effect to run `fetchProduct` when the component mounts
   * and whenever the 'id' parameter in the URL changes.
   */
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // --- 3. Event Handlers ---
  /**
   * Handles the "Generate AI" button click.
   * Calls the backend to generate a description and updates the state.
   */
  const handleGenerateAI = async () => {
    setProduct({ ...product, isGenerating: true }); // Set local loading state

    try {
      const response = await fetch(
        `${API_URL}/products/${id}/generate-description`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate description");
      }
      const updatedProduct = await response.json();
      setProduct(updatedProduct); // Update state with the new product data (including description)
    } catch (err) {
      alert(`AI Error: ${err.message}`);
      setProduct({ ...product, isGenerating: false, genError: err.message });
    }
  };

  /**
   * Handles the "Delete Product" button click.
   * Calls the backend to delete the product and redirects to home.
   */
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
      alert("Product deleted! Redirecting to home...");
      router.push("/"); // Redirect to the main product list page
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  // --- 4. Render Logic ---

  // Show a global loading bar while fetching
  if (isLoading) {
    return (
      <main className="container">
        <progress></progress>
      </main>
    );
  }

  // Show an error message if the fetch failed
  if (error) {
    return (
      <main className="container">
        <article style={{ backgroundColor: "#ffcccc", padding: "1rem" }}>
          <h2>Error</h2>
          <p>{error}</p>
          <Link href="/">Go back to Product List</Link>
        </article>
      </main>
    );
  }

  // This should not happen if loading/error logic is correct, but good practice
  if (!product) return null;

  // --- 5. Main Product Detail View ---
  return (
    <>
      <Head>
        <title>{product.name} - Smart Inventory</title>
      </Head>

      <main className="container" style={{ paddingTop: "2rem" }}>
        {/* Breadcrumb navigation */}
        <nav aria-label="breadcrumb">
          <ul>
            <li>
              <Link href="/">Product List</Link>
            </li>
            <li>{product.name}</li>
          </ul>
        </nav>

        {/* Product Details Card */}
        <article>
          <header>
            <h2>{product.name}</h2>
          </header>
          <p>
            <b>Attributes:</b> {product.attributes}
          </p>

          <hr />

          {/* AI Description Section */}
          <h3>AI Generated Description</h3>
          <div
            className={`description ${product.isGenerating ? "loading" : ""}`}
          >
            {product.isGenerating ? (
              "Contacting AI (Replicate), please wait... 🤖"
            ) : product.genError ? (
              <span style={{ color: "red" }}>Error: {product.genError}</span>
            ) : product.description ? (
              product.description
            ) : (
              "AI description not generated yet..."
            )}
          </div>

          {/* Action Buttons */}
          <footer>
            <div className="grid">
              {/* AI Button Logic: changes based on state */}
              {product.genError ? (
                <button onClick={handleGenerateAI}>✨ Try Again</button>
              ) : (
                <button
                  onClick={handleGenerateAI}
                  disabled={product.isGenerating}
                  className={product.description ? "secondary" : ""} // Make button secondary if description exists
                >
                  {product.isGenerating
                    ? "Generating..."
                    : product.description
                    ? "✨ Re-generate Description"
                    : "✨ Generate Description (AI)"}
                </button>
              )}

              {/* Delete Button */}
              <button className="outline" onClick={handleDelete}>
                Delete Product
              </button>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
