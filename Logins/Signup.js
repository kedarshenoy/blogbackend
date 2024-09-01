const express = require("express");
const router = express.Router();

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
          }).then(() => {
            console.log('Data stored successfully');
        res.status(200).send("User Data stored successfully");
          }).catch(error => {
            console.error('Error storing data:', error);
            res.status(400).send("Error storing User Data");
          });
      }})
    
})

module.exports = router;