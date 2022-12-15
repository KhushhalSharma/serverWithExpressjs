const express = require("express");
const res = require("express/lib/response");

const fs = require("fs");

const dbFile = fs.readFileSync(`${__dirname}/../db.json`, {
  encoding: "utf-8",
});

const updateDb = (updatedData) => {
  fs.writeFileSync(`${__dirname}/../db.json`, JSON.stringify(updatedData), {
    encoding: "utf-8",
  });
};

const db = JSON.parse(dbFile);

let products = db.products;

const app = express();
app.use(express.json());

// Front Page
app.get("/", (req, res) => {
  res.send("hello khushhal welcome to your server");
});

// All products
app.get("/products", (req, res) => {
  res.send(products);
});

// Get Single Product
app.get("/products/:id", (req, res) => {
  let { id } = req.params;
  let product = products.find((p) => p.id === Number(id));
  if (!product) {
    res.status(404).send("Not Product Found With this id");
  }
  res.send(product);
});

// Delete products

app.delete("/products/:id", (req, res) => {
  let { id } = req.params;
  let index = products.findIndex((p) => p.id === Number(id));
  products.splice(index, 1);
  updateDb({ ...db, products });
  res.send(products);
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});

// Post products

app.post("/products", (req, res) => {
  products.push(req.body);
  updateDb({ ...db, products });
  res.send("done");
});

// Patch products

app.patch("/products/:id", (req, res) => {
  let { id } = req.params;
  products = products.map((p) => {
    if (p.id === Number(id)) {
      return {
        ...p,
        ...req.body,
      };
    } else return p;
  });
  updateDb({ ...db, products });
  res.send("Updated");
});
