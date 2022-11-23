const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
require("dotenv").config();

//middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running dewan");
});

app.listen(port, () => {
  console.log("this is running port");
});
