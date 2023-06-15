const { client } = require("../../mongoDbConnection");

const user_collections = client.db("apertureacademy").collection("users");

const instructorVerify = async (req, res, next) => {
  const email = req.user.email;
  const fetchUser = await user_collections.findOne(
    { email: email },
    { projection: { role: 1 } }
  );
  // console.log(fetchUser.role);
  if (fetchUser.role === "instructor") {
    next();
  } else {
    return res.status(401).send({ error: "unauthorized access" });
  }
};

module.exports = instructorVerify;
