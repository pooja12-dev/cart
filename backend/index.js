const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const cartRoutes= require("./routes/cartRoutes")
// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// // Import routes
// const cartRoutes = require("./routes/cartRoutes");

// // Use routes
// app.use("/api/cart", cartRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
