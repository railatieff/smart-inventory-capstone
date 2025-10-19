require("dotenv").config({ path: "../.env" });
const Replicate = require("replicate");

/**
 * AI Service Module
 * This file handles all communication with the Replicate API to generate
 * product descriptions using the IBM Granite model.
 */

// Initialize the Replicate client with the API key from .env
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

// The specific model version on Replicate for IBM Granite
// Format: "owner/name:version_hash"
const modelVersion =
  "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8";

/**
 * Generates a product description using the AI model.
 * @param {string} productName - The name of the product.
 * @param {string} attributes - Keywords/attributes of the product.
 * @returns {Promise<string>} A promise that resolves to the generated text.
 */
async function generateDescription(productName, attributes) {
  // The prompt sent to the AI. We're asking for a "persuasive" description.
  const prompt = `
        Please create an attractive and persuasive product description for an e-commerce website.
        Use a professional and engaging tone.
        The description should be in English.
        Keep it to 2-3 short paragraphs.

        Product Information:
        - Product Name: ${productName}
        - Characteristics/Attributes: ${attributes}
    `;

  console.log(`[AI Service] Sending prompt to Replicate (IBM Granite)...`);

  try {
    // Call the Replicate API
    const output = await replicate.run(modelVersion, {
      input: {
        prompt: prompt,
        max_new_tokens: 300,
        min_new_tokens: 50,
        temperature: 0.8,
      },
    });

    // The output is an array of strings; we join them together.
    const description = output.join("");

    if (!description) {
      throw new Error("Replicate API did not return any text.");
    }

    console.log(
      `[AI Service] Successfully received description from Replicate.`
    );
    return description.trim(); // Trim whitespace
  } catch (error) {
    // Log the specific error and re-throw it so the API endpoint can catch it
    console.error("[AI Service] Error calling Replicate:", error.message);
    throw new Error(
      error.message || "Failed to generate description from AI Replicate."
    );
  }
}

// Export the function to be used by index.js
module.exports = { generateDescription };
