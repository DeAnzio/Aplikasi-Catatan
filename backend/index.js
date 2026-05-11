const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
require("./schema/User");

const app = express();
let databaseReady = false;

const defaultOrigins = [
  "http://localhost",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
];
const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = [...defaultOrigins, ...configuredOrigins];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin tidak diizinkan oleh CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Aplikasi Catatan API",
    status: "ok",
    endpoints: {
      notes: "/api/notes",
      health: "/health",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: databaseReady ? "connected" : "connecting",
  });
});

app.use("/api/notes", userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    databaseReady = true;
    console.log("Database synced");
  })
  .catch((error) => {
    console.error("Gagal koneksi/sinkronisasi database:", error);
  });
