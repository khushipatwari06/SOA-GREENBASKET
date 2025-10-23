const express = require("express");
const router = express.Router();
const { searchProducts } = require("../utils/searchProducts");

/**
 * GET /api/products/search
 * Query Parameters:
 *  - query: string (required) - the search term
 */
router.get("/search", (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Please enter something to search." });
  }

  try {
    const products = searchProducts(query);

    if (products.length === 0) {
      return res.status(404).json({ error: "No products found." });
    }

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

module.exports = router;

