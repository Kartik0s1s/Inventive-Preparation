require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./config/db");

const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Backend server is running");
});

app.use("/api/employees", employeeRoutes);

const PORT = 5000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});