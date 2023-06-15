const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { client } = require("../../mongoDbConnection");
const verifyJwt = require("../middlewares/verifyJwt");
const instructorVerify = require("../middlewares/instructorVerify");
// mongo db collections
const classes_collection = client.db("apertureacademy").collection("classes");

// route 1 : Add class
router.post("/addclass", verifyJwt, instructorVerify, async (req, res) => {
  const classInfo = req.body;
  let addClassReq = await classes_collection.insertOne(classInfo);
  res.send(addClassReq);
});

module.exports = router;
