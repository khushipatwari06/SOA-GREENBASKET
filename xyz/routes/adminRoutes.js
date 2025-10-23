const express = require("express");
const addProductRoute = require("./admin/addProduct");
const removeProductRoute = require("./admin/removeProduct");
const updateProductRoute = require("./admin/updateProduct");
const adminMetadataRoutes = require("./admin/adminMetadata");

const router = express.Router();

router.use("/add-product", addProductRoute);
router.use("/remove-product", removeProductRoute);
router.use("/update-product", updateProductRoute);


router.use("/", adminMetadataRoutes);

module.exports = router;
