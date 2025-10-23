const express = require("express");
const { loadProducts } = require("../utils/loadProducts");

const router = express.Router();

router.get("/store", (req, res) => {
  const products = loadProducts();
  const groupedProducts = {};

  products.forEach((product) => {
    if (!groupedProducts[product.category]) {
      groupedProducts[product.category] = [];
    }
    groupedProducts[product.category].push(product);
  });

  res.json(groupedProducts);
});

module.exports = router;
