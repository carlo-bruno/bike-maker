const express = require("express");
const layouts = require("express-ejs-layouts");
const request = require("request");
const methodOverride = require("method-override");
const db = require("./models");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3001;

app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("static"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("index");
});

// get all
app.get("/bikes", (req, res) => {
  db.bike.findAll().then(bikes => {
    res.render("bikes/index", { bikes });
  });
});
// get new form
app.get("/bikes/new", (req, res) => {
  let uri =
    "https://bikeindex.org:443/api/v3/manufacturers?page=1&per_page=100";

  request(uri, (err, response, body) => {
    let manufacturers = JSON.parse(body).manufacturers;
    res.render("bikes/new", { manufacturers });
  });
});

// get update page
app.get("/bikes/:id/edit", (req, res) => {
  let id = req.params.id;
  let uri =
    "https://bikeindex.org:443/api/v3/manufacturers?page=1&per_page=100";

  request(uri, (err, response, body) => {
    let manufacturers = JSON.parse(body).manufacturers;
    db.bike.findById(id).then(bike => {
      // res.json(bike);
      res.render("bikes/edit", { bike, manufacturers });
    });
  });
});

// get one
app.get("/bikes/:id", (req, res) => {
  let id = req.params.id;
  db.bike.findById(id).then(bike => {
    res.render("bikes/show", { bike });
  });
});
// create one
app.post("/bikes", (req, res) => {
  db.bike
    .create({
      manufacturer: req.body.manufacturer,
      year: req.body.year,
      model: req.body.model,
      size: req.body.size
    })
    .then(() => {
      res.redirect("/bikes");
    });
});

// update one
app.put("/bikes/:id", (req, res) => {
  let id = req.params.id;
  db.bike
    .update(
      {
        manufacturer: req.body.manufacturer,
        year: req.body.year,
        model: req.body.model,
        size: req.body.size
      },
      {
        where: { id }
      }
    )
    .then(() => {
      res.redirect("/bikes/" + id);
    });
});

// destroy one
app.delete("/bikes/:id", (req, res) => {
  db.bike
    .destroy({
      where: { id: req.params.id }
    })
    .then(() => {
      res.redirect("/bikes");
    });
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
