const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
//compare the user and password with the users json file
app.post("/login", (req, res) => {
  const { name, password } = req.body;
  fs.readFile("./data/users.json", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error reading file");
    } else {
      const users = JSON.parse(data);
      const user = users.find((u) => {
        console.log(u.name);
        return u.name === name && u.password === password;
      });
      if (user) {
        res.status(200).send({
          message: "Login successful",
          user,
        });
      } else {
        res.status(401).send("Invalid username or password");
      }
    }
  });
});
app.post("/products", (req, res) => {
  const { name, price, description, category } = req.body;

  //GET THE PRODUCTS JSON FILE
  fs.readFile("./data/products.json", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const products = JSON.parse(data);
      const product = {
        id: products.length + 1,
        name,
        price,
        description,
        category,
      };
      products.push(product);
      fs.writeFile("./data/products.json", JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        } else {
          res.status(201).send(product);
        }
      });
    }
  });
});
//get product by name
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("./data/products.json", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const products = JSON.parse(data);
      const product = products.find((p) => p.id == id);
      if (product) {
        res.status(200).send(product);
      } else {
        res.status(404).send("Product not found");
      }
    }
  });
});
app.get("/products", (req, res) => {
  res.send(products);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
