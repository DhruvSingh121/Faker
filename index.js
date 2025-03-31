const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const faker = require("@faker-js/faker");
const methodOverride = require("method-override");

const app = express();

app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); // __dirname will work now

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "app",
  password: "ds121",
});

//Home Page
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  connection.query(q, (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error in DB");
    }
    let count = result[0]["count(*)"];
    res.render("home.ejs", { count });
  });
});

//Show Users
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  connection.query(q, (err, users) => {
    if (err) {
      console.log(err);
      return res.send("Error in DB");
    }
    // console.log(result);
    res.render("showuser.ejs", { users });
  });
});

//Edit User
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  connection.query(q, (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error in DB");
    }
    console.log(result);
    let user = result[0];
    res.render("edit.ejs", { user });
  });
});

//UPDate Route
app.patch("/user/:id", (req, res) => {
  console.log("Received Body:", req.body);
  let { id } = req.params;
  let { password: formPass, username: newUserName } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("WRONG PASSWORD");
      } else {
        let q2 = `UPDATE user SET username ='${newUserName}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("err in db");
  }
});

const port = "8080";
app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});
