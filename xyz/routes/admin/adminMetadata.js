const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const metadataPath = path.join(process.cwd(), "data", "metadata.json");


// Utility to load metadata
const loadMetadata = () => {
  if (fs.existsSync(metadataPath)) {
    return JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  }
  return {};
};

// Utility to save metadata
const saveMetadata = (metadata) => {
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
};

// Add metadata entries
router.patch("/metadata/add", (req, res) => {
  const entries = req.body; // Expecting an array of objects
  console.log(entries);
  if (!Array.isArray(entries)) {
    return res.status(400).json({ message: "Entries must be an array." });
  }

  const metadata = loadMetadata();

  entries.forEach((entry) => {
    // Normalize keys and values to lowercase
    const normalized = {};
    Object.keys(entry).forEach((key) => {
      normalized[key.toLowerCase()] = entry[key].toLowerCase();
    });

    const section = normalized.section;
    const category = normalized.category;
    const product = normalized.product;

    if (!section || !category || !product) {
      return res
        .status(400)
        .json({ message: "Section, category, and product are required." });
    }

    if (!metadata[section]) {
      metadata[section] = [];
    }

    // Add the product under the section if not present
    const entryObj = { category, product };
    const exists = metadata[section].some(
      (e) =>
        e.category.toLowerCase() === category &&
        e.product.toLowerCase() === product
    );
    if (!exists) {
      metadata[section].push(entryObj);
    }
  });

  saveMetadata(metadata);
  res.json({ message: "Metadata updated successfully.", metadata });
});

// Remove metadata entries
router.patch("/metadata/remove", (req, res) => {
  const entries = req.body; // Expecting an array of objects
  if (!Array.isArray(entries)) {
    return res.status(400).json({ message: "Entries must be an array." });
  }

  const metadata = loadMetadata();

  entries.forEach((entry) => {
    // Normalize keys and values
    const normalized = {};
    Object.keys(entry).forEach((key) => {
      normalized[key.toLowerCase()] = entry[key].toLowerCase();
    });

    const section = normalized.section;
    const category = normalized.category;
    const product = normalized.product;

    if (!section || !category || !product) {
      return res
        .status(400)
        .json({ message: "Section, category, and product are required." });
    }

    if (metadata[section]) {
      metadata[section] = metadata[section].filter(
        (e) =>
          e.category.toLowerCase() !== category ||
          e.product.toLowerCase() !== product
      );
    }
  });

  saveMetadata(metadata);
  res.json({ message: "Metadata entries removed successfully.", metadata });
});

// Get metadata
router.get("/metadata", (req, res) => {
  const metadata = loadMetadata();
  res.json(metadata);
});

module.exports = router;
