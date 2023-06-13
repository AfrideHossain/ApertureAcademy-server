const express = require("express");
const router = express.Router();
require("dotenv").config();

// route 1 : Save user info to db
router.post("/createuser", async (req, res) => {
  const userdata = req.body;
  console.log(userdata);
});
