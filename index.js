const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const addedProductsCollection = client
      .db("ResaleProducts")
      .collection("addedProducts");

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

    //get bookings by email
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    //add product
    app.post("/addProduct", async (req, res) => {
      const added = req.body;
      const result = await addedProductsCollection.insertOne(added);
      res.send(result);
    });
    //get added product
    app.get("/addProduct", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await addedProductsCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/addProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addedProductsCollection.deleteOne(query);
      res.send(result);
    });

    // //update products
    // app.get("/updateProduct", async (req, res) => {
    //   const query = {};
    //   const option = { upsert: true };
    //   const updatedDoc = {
    //     $set: {
    //       date: "Nov-25-22",
    //     },
    //   };
    //   const result = await productsCollection.updateMany(
    //     query,
    //     updatedDoc,
    //     option
    //   );
    //   console.log(result);
    //   res.send(result);
    // });
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
