const express = require("express");
const fs = require("fs");
const path = require("path");
const { loadProducts } = require("../utils/loadProducts");

const router = express.Router();

const metadataPath = path.join(__dirname, "../data/metadata.json");
const loadMetadata = () => JSON.parse(fs.readFileSync(metadataPath, "utf8"));

const getProductsByEntries = (products, entries) => {
  return entries
    .map((entry) =>
      products.find(
        (p) =>
          p.name.toLowerCase() === entry.product.toLowerCase() &&
          p.category.toLowerCase() === entry.category.toLowerCase()
      )
    )
    .filter((p) => p); // Remove not found entries
};

router.get("/homepage", (req, res) => {
  const products = loadProducts();
  const metadata = loadMetadata();

  res.json({
    bestselling: getProductsByEntries(products, metadata.bestselling),
    editors_choice: getProductsByEntries(products, metadata.editors_choice),
  });
});

module.exports = router;
