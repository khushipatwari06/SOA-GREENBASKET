const fs = require("fs");
const path = require("path");
const generateId = require("./generateId");
const { getCachedProducts, updateCache } = require("./cache");
require("dotenv").config();

const IMAGE_PATH =
  process.env.IMAGE_PATH ||
  `http://localhost:${process.env.PORT || 5000}/api/images`;

const IMAGE_EXCLUDED_FOLDERS = (process.env.IMAGE_EXCLUDED_FOLDERS || "")
  .split(",")
  .map((folder) => folder.trim().toLowerCase());

const productsJsonPath = path.join(__dirname, "../data/products.json");

// Load existing price data
const loadProductPrices = () => {
  if (fs.existsSync(productsJsonPath)) {
    return JSON.parse(fs.readFileSync(productsJsonPath, "utf-8"));
  }
  return {};
};

// Save updated price data
const saveProductPrices = (priceData) => {
  fs.writeFileSync(
    productsJsonPath,
    JSON.stringify(priceData, null, 2),
    "utf-8"
  );
};

// Main loadProducts function with exclusions and forceRefresh support
const loadProducts = (forceRefresh = false) => {
  const cached = getCachedProducts();
  if (cached && !forceRefresh) return cached;

  console.log("Refreshing product list...");
  const baseDir = path.join(__dirname, "../images");
  const priceData = loadProductPrices();
  let products = [];
  let updated = false;

  fs.readdirSync(baseDir).forEach((category) => {
    if (IMAGE_EXCLUDED_FOLDERS.includes(category.toLowerCase())) {
      console.log(`Skipping excluded folder: ${category}`);
      return;
    }

    const categoryPath = path.join(baseDir, category);
    if (fs.lstatSync(categoryPath).isDirectory()) {
      fs.readdirSync(categoryPath).forEach((file) => {
        if (path.extname(file).toLowerCase() !== ".jpg") return;

        const productName = path.basename(file, path.extname(file));
        const key = `${category}/${productName}`;

        let price = priceData[key]?.price;
        if (!price) {
          price = (Math.random() * 1000 + 100).toFixed(2);
          priceData[key] = { price: parseFloat(price) };
          updated = true;
        }

        const relativePath = `${category}/${file}`;
        products.push({
          id: generateId(relativePath),
          name: productName,
          price,
          imgUrl: `${IMAGE_PATH}/${relativePath}`,
          category,
        });
      });
    }
  });

  if (updated) {
    console.log("Updating products.json with new entries...");
    saveProductPrices(priceData);
  }

  updateCache(products);
  return products;
};

module.exports = { loadProducts };
