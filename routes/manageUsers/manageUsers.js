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
// route # : Get all instructors
router.get("/users/instructors", async (req, res) => {
  let instructors = await user_collections
    .find({ role: "instructor" })
    .toArray();
  res.send(instructors);
});
// route # : Get all instructors with limit
router.get("/users/popularinstructors", async (req, res) => {
  let instructors = await user_collections
    .find({ role: "instructor" })
    .limit(6)
    .toArray();
  res.send(instructors);
});
// route 2 : make instructor
router.put("/user/changerole/:id", verifyJwt, adminVerify, async (req, res) => {
  const userId = req.params.id;
  const role = req.body.role;
  let changeRole = await user_collections.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: role } }
  );
  res.send(changeRole);
});

// route 3 : Get all selected classes
router.get("/users/selectedclasses/:email", verifyJwt, async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  let selectedClasses = await user_collections.findOne(query, {
    projection: { selectedClasses: 1, _id: 0 },
  });
  res.send(selectedClasses);
});
// route 4 : add new selected class
router.put("/users/selectedclasses/:email", verifyJwt, async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const newClasses = req.body.newClasses;
  console.log("newClasses = ", newClasses);
  let updateSelectedClasses = await user_collections.updateOne(query, {
    $set: { selectedClasses: newClasses },
  });
  console.log(updateSelectedClasses);
  res.send(updateSelectedClasses);
});
// route 5 : Get all enrolled classes
router.get("/users/enrolledclasses/:email", verifyJwt, async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  let enrolledClasses = await user_collections.findOne(query, {
    projection: { selectedClasses: 1, _id: 0 },
  });
  res.send(enrolledClasses);
});

module.exports = router;
