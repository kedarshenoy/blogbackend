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

module.exports = router;