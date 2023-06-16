const express = require("express");
const router = express.Router();
require("dotenv").config();
const { client } = require("../../mongoDbConnection");
const verifyJwt = require("../middlewares/verifyJwt");
const instructorVerify = require("../middlewares/instructorVerify");
const adminVerify = require("../middlewares/adminVerify");
const { ObjectId } = require("mongodb");
// mongo db collections
const classes_collection = client.db("apertureacademy").collection("classes");

// route 1 : Add class
router.post("/addclass", verifyJwt, instructorVerify, async (req, res) => {
  const classInfo = req.body;
  let addClassReq = await classes_collection.insertOne(classInfo);
  res.send(addClassReq);
});
// route 1 : Instructors classes
router.get(
  "/instructorsclasses",
  verifyJwt,
  instructorVerify,
  async (req, res) => {
    const email = req.user.email;
    const query = { instructorEmail: email };
    let classes = await classes_collection.find(query).toArray();
    res.send(classes);
  }
);
// route 2 : All classes
router.get("/allclasses", verifyJwt, adminVerify, async (req, res) => {
  let classes = await classes_collection.find().toArray();
  res.send(classes);
});
// route 3 : Update class status to approve
router.put("/class/approve/:id", verifyJwt, adminVerify, async (req, res) => {
  const classId = req.params.id;
  let approveClass = await classes_collection.updateOne(
    { _id: new ObjectId(classId) },
    { $set: { status: "approved" } }
  );
  res.send(approveClass);
});
// route 4 : Update class status to denied
router.put("/class/deny/:id", verifyJwt, adminVerify, async (req, res) => {
  const classId = req.params.id;
  const feedback = req.body.feedback;
  let denyClass = await classes_collection.updateOne(
    { _id: new ObjectId(classId) },
    { $set: { status: "denied", feedback: feedback } }
  );
  res.send(denyClass);
});
// route 5 : Approved classes
router.get("/approvedclasses", async (req, res) => {
  const query = { status: "approved" };
  let classes = await classes_collection
    .find(query, { projection: { status: 0, feedback: 0 } })
    .toArray();
  return res.send(classes);
});
// route 6 : classes by id
router.post("/classesbyid", async (req, res) => {
  const ids = req.body.ids;
  let objectIds = [];
  ids.forEach((id) => {
    objectIds.push(new ObjectId(id));
  });
  let classes = await classes_collection
    .find(
      { _id: { $in: objectIds } },
      { projection: { status: 0, feedback: 0 } }
    )
    .toArray();
  return res.send(classes);
});

// route 5 : Popular classes
router.get("/popularclasses", async (req, res) => {
  let classes = await classes_collection
    .find(
      { status: "approved" },
      { sort: { students: -1 }, projection: { status: 0, feedback: 0 } }
    )
    .limit(6)
    .toArray();
  return res.send(classes);
});

module.exports = router;
