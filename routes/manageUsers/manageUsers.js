const express = require("express");
const router = express.Router();
require("dotenv").config();
const { client } = require("../../mongoDbConnection");
const verifyJwt = require("../middlewares/verifyJwt");
const adminVerify = require("../middlewares/adminVerify");
const { ObjectId } = require("mongodb");
// mongo db collections
const user_collections = client.db("apertureacademy").collection("users");

// route 1 : Get all users
router.get("/users", verifyJwt, adminVerify, async (req, res) => {
  let users = await user_collections.find().toArray();
  res.send(users);
});
// route 2 : make instructor
router.put(
  "/user/makeInstructor/:id",
  verifyJwt,
  adminVerify,
  async (req, res) => {
    const userId = req.params.id;
    let makeInstructor = await user_collections.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { status: "approved" } }
    );
    res.send(makeInstructor);
  }
);
module.exports = router;
