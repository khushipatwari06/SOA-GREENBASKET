const crypto = require("crypto");

const generateId = (filePath) => {
  return crypto.createHash("md5").update(filePath).digest("hex").slice(0, 8);
};

module.exports = generateId;
