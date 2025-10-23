const { loadProducts } = require("./loadProducts");

// Optional: Try to use fuzzy matching if a library like 'fuzzysort' is available
let fuzzysort;
try {
  fuzzysort = require("fuzzysort");
} catch (error) {
  console.log("Fuzzy search library not available. Using exact matches only.");
}

/**
 * Search products by name
 * @param {string} query - The name (or partial name) to search for
 * @param {boolean} [forceRefresh=false] - Whether to force reload the product list
 * @returns {Array} Filtered products matching the query
 */
const searchProducts = (query, forceRefresh = false) => {
  const products = loadProducts(forceRefresh);

  if (!query || typeof query !== "string") return [];

  const normalizedQuery = query.trim().toLowerCase();

  if (fuzzysort) {
    const results = fuzzysort.go(normalizedQuery, products, {
      key: "name",
      threshold: -10000, // Optional: adjust how "loose" the matching is
    });
    return results.map((res) => res.obj);
  } else {
    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery)
    );
  }
};

module.exports = { searchProducts };


