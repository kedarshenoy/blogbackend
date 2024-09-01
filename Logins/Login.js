const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { db } = req;
  const ref = db.ref('users');
  const { email, Password } = req.body;

  // Query the database to check for existing user with same email and Password
  ref.orderByChild("email").equalTo(email).once("value", snapshot => {
    if (snapshot.exists()) {
      // Check if any of the matched records also has the same password
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
        // If the email exists but the password doesn't match, you can handle it accordingly
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
