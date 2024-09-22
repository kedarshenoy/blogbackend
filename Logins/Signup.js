const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken =  (email) => {
  return jwt.sign(
    {
      "username": email
    },
    JWT_SECRET
  );
};
router.post("/", async (req, res) => {
    const { db } = req;
    const ref = db.ref('users');
    const {name,email,Password} = req.body;

    ref.orderByChild("email").equalTo(email).once("value", snapshot => {
      if (snapshot.exists()) {
        res.status(400).send("User with this email  already exists");
      }
      else{
        ref.push({
          name:name,
          email: email,
          Password:Password,
          prof:16
          }).then(() => {
        const token =generateToken(email);
            console.log('Data stored successfully'+token);
        res.status(200).json({Token:token});
          }).catch(error => {
            console.error('Error storing data:', error);
            res.status(400).send("Error storing User Data");
          });
      }})
    
})


router.post("/avt", async (req, res) => {
  const { db } = req;
  const ref = db.ref('users');
  const { email, prof } = req.body; // Expecting email and prof in the request body
  console.log(email,prof)
  ref.orderByChild("email").equalTo(email).once("value", async (snapshot) => {
    if (snapshot.exists()) {
      let userKey = null;
      let user = null;

      snapshot.forEach(childSnapshot => {
        userKey = childSnapshot.key; // Get the user key
        user = childSnapshot.val(); // Get user data
      });

      // Check if the user already has a profile
      if (user.prof) {
        // Update the existing profile
        await ref.child(userKey).update({ prof });
        return res.status(200).json({ message: "Profile updated successfully" });
      } else {
        // Add new profile
        await ref.child(userKey).update({ prof });
        return res.status(200).json({ message: "Profile added successfully" });
      }
    } else {
      // User not found - decide how to handle this case
      return res.status(404).send("User not found");
    }
  }).catch(error => {
    console.error('Error querying database:', error);
    res.status(500).send("Error querying database");
  });
});


module.exports = router;