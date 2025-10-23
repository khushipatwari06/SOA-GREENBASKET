const express = require("express");
const router = express.Router();
const { loadProducts } = require("../utils/loadProducts");
const { clearCache } = require("../utils/cache");

// Get all products
router.get("/", (req, res) => {
  const products = loadProducts();
  res.json(products);
});

// Refresh products and return updated list
router.get("/refresh", (req, res) => {
  clearCache();
  const products = loadProducts(true);
  res.json({ message: "Cache refreshed.", products });
});

module.exports = router;
