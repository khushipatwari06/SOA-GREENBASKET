const express = require("express");
const fs = require("fs");
const path = require("path");
const { clearCache } = require("../../utils/cache");
const { loadProducts } = require("../../utils/loadProducts");

const router = express.Router();
const productsJsonPath = path.join(__dirname, "../../data/products.json");

router.post("/", (req, res) => {
  try {
    const {
      oldCategory,
      oldProductName,
      newProductName,
      newCategory,
      newPrice,
    } = req.body;

    if (!oldCategory || !oldProductName) {
      return res
        .status(400)
        .json({ error: "oldCategory and oldProductName are required." });
    }

    const oldKey = `${oldCategory}/${oldProductName}`;
    if (!fs.existsSync(productsJsonPath)) {
      return res.status(404).json({ error: "products.json not found." });
    }

    const productsData = JSON.parse(fs.readFileSync(productsJsonPath, "utf-8"));
    const productEntry = productsData[oldKey];

    if (!productEntry) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Determine new paths and keys
    const finalCategory = newCategory || oldCategory;
    const finalProductName = newProductName || oldProductName;
    const oldImagePath = path.join(
      __dirname,
      `../../images/${oldCategory}/${oldProductName}.jpg`
    );
    const newImagePath = path.join(
      __dirname,
      `../../images/${finalCategory}/${finalProductName}.jpg`
    );
    const newKey = `${finalCategory}/${finalProductName}`;

    // Move or rename file if needed
    if (oldCategory !== finalCategory || oldProductName !== finalProductName) {
      if (!fs.existsSync(path.dirname(newImagePath))) {
        fs.mkdirSync(path.dirname(newImagePath), { recursive: true });
      }
      fs.renameSync(oldImagePath, newImagePath);
    }

    // Update product data in products.json
    const updatedProduct = { price: productEntry.price };

    if (newPrice) {
      updatedProduct.price = newPrice;
    }

    productsData[newKey] = updatedProduct;
    delete productsData[oldKey];

    fs.writeFileSync(
      productsJsonPath,
      JSON.stringify(productsData, null, 2),
      "utf-8"
    );

    // Clear cache & reload
    clearCache();
    const refreshed = loadProducts(true);

    res.json({
      message: "Product updated successfully.",
      updatedProducts: refreshed,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
