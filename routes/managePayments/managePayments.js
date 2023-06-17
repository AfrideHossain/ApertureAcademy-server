const express = require("express");
const router = express.Router();
require("dotenv").config();
const { client } = require("../../mongoDbConnection");
const verifyJwt = require("../middlewares/verifyJwt");
const { ObjectId, AggregationCursor } = require("mongodb");
// mongo db collections
const user_collections = client.db("apertureacademy").collection("users");
const payment_collections = client.db("apertureacademy").collection("payments");
const classes_collection = client.db("apertureacademy").collection("classes");

router.post("/payment-process", verifyJwt, async (req, res) => {
  const {
    paymentID,
    payerID,
    createTime,
    paidBy,
    name,
    email,
    totalAmount,
    classesIds,
  } = req.body;
  let classObjectIds = [];
  classesIds.forEach((id) => {
    classObjectIds.push(new ObjectId(id));
  });
  const insertDoc = {
    paymentID,
    payerID,
    createTime,
    paidBy,
    name,
    email,
    totalAmount,
  };

  try {
    const insertPayment = await payment_collections.insertOne(insertDoc);
    if (insertPayment.insertedId) {
      const updateUser = await user_collections.updateOne(
        { email: req.user.email },
        { $set: { selectedClasses: [], enrolledClasses: classesIds } }
      );
      // Update classes collection
      const updateClasses = await classes_collection.updateMany(
        { _id: { $in: classObjectIds } },
        { $inc: { seats: -1, students: 1 } }
      );
      if (updateUser.modifiedCount > 0 && updateClasses.modifiedCount > 0) {
        return res.json({ success: true, message: "Payment Inserted" });
      } else {
        return res.json({ success: false, message: "Payment inserted failed" });
      }
    } else {
      return res.json({ success: false, message: "Payment inserted failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error." });
  }
});
router.get("/payments/:email", verifyJwt, async (req, res) => {
  let email = req.params.email;
  const payments = await payment_collections.find({ email: email }).toArray();
  res.send(payments);
});

module.exports = router;
