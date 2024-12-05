const express = require("express");
const app = express();
const port = 3000;
const dotenv = require('dotenv').config();
const adminAuthorization = require('./middleware/adminAuthorization');
const cors = require('cors');
const path = require('path');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/qr-codes', express.static(path.join(__dirname, 'public/qr-codes')));

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Import controllers
const authController = require("./auth/auth.controller");
const productController = require("./product/product.controller");
const userController = require("./user/user.controller");
const orderController = require("./order/order.controller");

// Routes
app.use("/api/auth", authController);
app.use("/api/products", productController);
app.use("/api/users", adminAuthorization, userController);
app.use("/api/orders", orderController);

// Start the server
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

export default app;
