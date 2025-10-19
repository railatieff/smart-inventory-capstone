/**
 * Database connection module.
 * This file sets up the PostgreSQL connection pool using 'pg'.
 * It reads database credentials from environment variables (.env file).
 */

const { Pool } = require("pg");
require("dotenv").config({ path: "../.env" }); // Load .env variables

// Create a new connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection on startup
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database!", err.stack);
  } else {
    console.log("Successfully connected to the database:", res.rows[0].now);
  }
});

// Export a single query function to be used by other parts of the application
module.exports = {
  /**
   * Executes a SQL query against the database.
   * @param {string} text - The SQL query string (e.g., "SELECT * FROM users WHERE id = $1")
   * @param {Array} params - The parameters to safely inject into the query (e.g., [1])
   * @returns {Promise} A promise that resolves with the query result.
   */
  query: (text, params) => pool.query(text, params),
};
