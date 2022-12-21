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
    //categoriesCollection
    const categoriesCollection = client
      .db("ResaleProducts")
      .collection("categories");

    //productsCollection
    const productsCollection = client
      .db("ResaleProducts")
      .collection("Products");

    //bookingsCollection
    const bookingsCollection = client
      .db("ResaleProducts")
      .collection("bookings");

    //addedProductsCollection
    const addedProductsCollection = client
      .db("ResaleProducts")
      .collection("addedProducts");

    //usersCollection
    const usersCollection = client.db("ResaleProducts").collection("users");

    //advertiseCollection
    const advertiseCollection = client
      .db("ResaleProducts")
      .collection("advertise");

    //verify jwt
    function verifyJWT(req, res, next) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).send({ message: "Unauthorized access" });
      }
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.USER_TOKEN, function (error, decoded) {
        if (error) {
          return res.status(401).send({ message: "forbidden access" });
        }
        req.decoded = decoded;
        next();
      });
    }

    //set user to db
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

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

    //added product to all product
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    //get products by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categoryName: id };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    //advertise product
    app.get("/advertiseProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addedProductsCollection.find(query).toArray();
      res.send(result);
    });

    //set advertise product
    app.post("/setAdvertiseProduct", async (req, res) => {
      const advertised = req.body;
      const result = await advertiseCollection.insertOne(advertised);
      res.send(result);
    });

    //set advertise product
    app.get("/setAdvertiseProduct", async (req, res) => {
      const query = {};
      const result = await advertiseCollection.find(query).toArray();
      res.send(result);
    });

    //bookings
    app.post("/bookings", async (req, res) => {
      const booked = req.body;
      const result = await bookingsCollection.insertOne(booked);
      res.send(result);
    });

    //get bookings by email
    app.get("/bookings", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).send({ message: "Unauthorized access" });
      }
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

    //delete booking product
    app.delete("/addProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addedProductsCollection.deleteOne(query);
      res.send(result);
    });

    //jwt token
    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.USER_TOKEN, {
          expiresIn: "1d",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "" });
    });

    //update products
    // app.get("/updateProduct", async (req, res) => {
    //   const query = {};
    //   const option = { upsert: true };
    //   const updatedDoc = {
    //     $set: {
    //       categoryName: "nikon",
    //     },
    //   };
    //   const result = await categoriesCollection.updateMany(
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
