const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { db } = req;
  const ref = db.ref('users');
  const { email, Password } = req.body;

  ref.orderByChild("email").equalTo(email).once("value", snapshot => {
    if (snapshot.exists()) {
      let userExists = false;
      snapshot.forEach(childSnapshot => {
        if (childSnapshot.val().Password === Password) {
          userExists = true;
        }
      });

      if (userExists) {
        console.log('User with this email and password already exists');
        res.status(200).send("User with this email and password already exists");
      } else {
        res.status(400).send("Wrong password");
      }
    } else {
      res.status(404).send("User not found");
    }
  }).catch(error => {
    console.error('Error querying database:', error);
    res.status(500).send("Error querying database");
  });
});


module.exports = router;
