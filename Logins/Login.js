// const express = require("express");
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const JWT_SECRET =process.env.JWT_SECRET;

// const generateToken = async() => {
//   return jwt.sign(
//     {
//       "username":'aks'
//     },
//     JWT_SECRET
//   );
// };
// router.post("/", async (req, res) => {
//   const { db } = req;
//   const ref = db.ref('users');
//   const { email, Password } = req.body;
//   ref.orderByChild("email").equalTo(email).once("value", snapshot => {
//     if (snapshot.exists()) {
//       let userExists = false;
//       snapshot.forEach(childSnapshot => {
//         if (childSnapshot.val().Password === Password) {
//           const token =generateToken()
//           userExists = true;
//         }
//       });

//       if (userExists) {
//         console.log('User with this email and password already exists');
//         res.status(200).json({Token:token});
//       } else {
//         res.status(400).send("Wrong password");
//       }
//     } else {
//       res.status(404).send("User not found");
//     }
//   }).catch(error => {
//     console.error('Error querying database:', error);
//     res.status(500).send("Error querying database");
//   });
// });


// module.exports = router;


const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = async (mail) => {
  return jwt.sign(
    {
      "username": mail
    },
    JWT_SECRET
  );
};

router.post("/", async (req, res) => {
  const { db } = req;
  const ref = db.ref('users');
  const { email, Password } = req.body;

  ref.orderByChild("email").equalTo(email).once("value", async (snapshot) => {
    if (snapshot.exists()) {
      let userExists = false;
      let token = null;

      snapshot.forEach(childSnapshot => {
        if (childSnapshot.val().Password === Password) {
          token = generateToken(email);  // Generate the token inside the loop
          userExists = true;
        }
      });

      if (userExists) {
        console.log('User with this email and password already exists');
        res.status(200).json({ Token: await token });
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
