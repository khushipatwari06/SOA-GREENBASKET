const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/products");
const productSearchRoutes = require("./routes/productSearch");
const storeRoutes = require("./routes/store");
const homepageRoutes = require("./routes/homepage");
const loadAdminRoutes = require("./utils/loadAdminRoutes");
const path = require("path");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve images statically (TEMPORARY)
app.use("/api/images", express.static(path.join(__dirname, "images")));


// Register Routes
app.use("/api/products", productRoutes);
app.use("/api/products", productSearchRoutes);
app.use("/api", storeRoutes);
app.use("/api", homepageRoutes);

loadAdminRoutes(app);

const PORT = process.env.PORT || 5000;
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl}`);
  res.status(404).send(`Route not found: ${req.method} ${req.originalUrl}`);
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


