// Import Package dan File
const express = require("express");
const { sequelize, ensureDatabase } = require("./config/database");
const userRoutes = require("./routes/userRoutes");

// Inisialisasi Express dan Cors
const app = express();
const cors = require("cors");

// Izinkan semua origin agar frontend terpisah dapat mengakses backend
app.use(cors());

// Middleware untuk parsing JSON
app.use(express.json());

// Route dasar untuk testing
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Notes API berjalan" });
});

// Setting Routes
require("./schema/User"); // Untuk generate Tabel notes
app.use("/api/notes", userRoutes); // Set routes notes

// Sync Database dan Jalankan Server
const port = process.env.PORT || 3000;
ensureDatabase()
  .then(() => sequelize.sync())
  .then(() => {
    console.log("Database synced");
    app.listen(port, () => {
      console.log(`\n✅ Server running on port ${port}\n`);
    });
  })
  .catch((error) => {
    console.error("Gagal terhubung ke database:", error.message);
    process.exit(1);
  });
