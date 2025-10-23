let productCache = [];
let lastUpdated = 0;
const CACHE_TTL = 60 * 1000; // Cache expires every 60 seconds

const getCachedProducts = () => {
  const currentTime = Date.now();
  if (productCache.length > 0 && currentTime - lastUpdated < CACHE_TTL) {
    return productCache;
  }
  return null; // Cache expired
};

const updateCache = (products) => {
  productCache = products;
  lastUpdated = Date.now();
};
const clearCache = () => {
  productCache = [];
  lastUpdated = 0;
};

module.exports = { getCachedProducts, updateCache, clearCache };