const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { client } = require("../../mongoDbConnection");
// mongo db collections
const user_collections = client.db("apertureacademy").collection("users");

// route 1 : Save user info to db
router.post("/createuser", async (req, res) => {
  const userdata = req.body;
  const insertData = await user_collections.insertOne(userdata);
  res.send(insertData);
});

// route 2 : sign jwt
router.post("/jwtSign", async (req, res) => {
  let userData = req.body;
  let token = jwt.sign(userData, process.env.JWT_SECRET);
  res.send({ token });
});

module.exports = router;
