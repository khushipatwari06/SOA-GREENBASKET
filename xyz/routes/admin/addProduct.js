const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { loadProducts } = require("../../utils/loadProducts");
const { clearCache } = require("../../utils/cache");

const router = express.Router();
const productsJsonPath = path.join(__dirname, "../../data/products.json");

// ✅ Multer setup — store in temp folder first
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, "../../images/temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: tempStorage });

router.get("/", (req, res) => {
  res.send("Add Product GET route working");
});

// ✅ Add product route — simple fields expected
router.post("/", upload.single("image"), (req, res) => {
  try {
    const { category, productName, price } = req.body;
    const imageFile = req.file;

    console.log("Incoming product data:", req.body);
    console.log("Uploaded file:", req.file);

    if (!category || !productName || !imageFile) {
      return res
        .status(400)
        .json({ error: "category, productName, and image are required." });
    }

    // ✅ Create category folder if needed
    const categoryDir = path.join(__dirname, `../../images/${category}`);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    // ✅ Move image from temp to category with correct filename
    const finalImagePath = path.join(categoryDir, `${productName}.jpg`);
    fs.renameSync(imageFile.path, finalImagePath);

    // ✅ Update products JSON
    const finalPrice = price
      ? parseFloat(price)
      : (Math.random() * 1000 + 100).toFixed(2);

    const productsData = fs.existsSync(productsJsonPath)
      ? JSON.parse(fs.readFileSync(productsJsonPath, "utf-8"))
      : {};

    const key = `${category}/${productName}`;
    productsData[key] = { price: parseFloat(finalPrice) };

    fs.writeFileSync(
      productsJsonPath,
      JSON.stringify(productsData, null, 2),
      "utf-8"
    );

    clearCache();
    const updatedProducts = loadProducts(true);

    res.status(201).json({
      message: "Product added successfully.",
      product: key,
      updatedProducts,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
