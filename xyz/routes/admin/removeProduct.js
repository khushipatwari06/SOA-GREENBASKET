const express = require("express");
const fs = require("fs");
const path = require("path");
const { clearCache } = require("../../utils/cache");
const { loadProducts } = require("../../utils/loadProducts");

const router = express.Router();
const productsJsonPath = path.join(__dirname, "../../data/products.json");

router.post("/", (req, res) => {
  try {
    const { category, productName } = req.body;
    if (!category || !productName) {
      return res
        .status(400)
        .json({ error: "category and productName are required." });
    }

    // Delete image
    const imagePath = path.join(
      __dirname,
      `../../images/${category}/${productName}.jpg`
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    } else {
      return res.status(404).json({ error: "Image not found." });
    }

    // Remove from products.json
    if (fs.existsSync(productsJsonPath)) {
      const productsData = JSON.parse(
        fs.readFileSync(productsJsonPath, "utf-8")
      );
      const key = `${category}/${productName}`;
      if (productsData[key]) {
        delete productsData[key];
        fs.writeFileSync(
          productsJsonPath,
          JSON.stringify(productsData, null, 2),
          "utf-8"
        );
      }
    }

    // Clear cache & refresh
    clearCache();
    const updatedProducts = loadProducts(true);

    res.json({ message: "Product removed successfully.", updatedProducts });
  } catch (err) {
    console.error("Error removing product:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
