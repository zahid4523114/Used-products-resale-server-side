const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.j5z5yuh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //collections
    const categoriesCollection = client
      .db("ResaleProducts")
      .collection("categories");
    const productsCollection = client
      .db("ResaleProducts")
      .collection("Products");
    const bookingsCollection = client
      .db("ResaleProducts")
      .collection("bookings");

    //get category from db
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoriesCollection.find(query).toArray();
      res.send(result);
    });

    // get products from db
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    //get products by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { productId: id };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    //bookings
    app.post("/bookings", async (req, res) => {
      const booked = req.body;
      const result = await bookingsCollection.insertOne(booked);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => {
  console.log(err);
});

app.get("/", (req, res) => {
  res.send("server is running dewan");
});

app.listen(port, () => {
  console.log("this is running port");
});
