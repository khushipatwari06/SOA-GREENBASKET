const path = require("path");

const loadAdminRoutes = (app) => {
  if (process.env.ENABLE_ADMIN === "true") {
    const adminRoutes = require(path.join(
      __dirname,
      "../routes/adminRoutes"
    ));
    app.use("/api/admin", adminRoutes);
    console.log("✅ Admin console enabled.");
  } else {
    console.log("❌ Admin console disabled.");
  }
};

module.exports = loadAdminRoutes;
