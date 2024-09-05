const express = require("express");
const router = express.Router();



router.post('/', (req, res) => {
    const { db } = req;
    const {postId} =req.body;
    // const postId = '-O5dXs09xSEoYC487V9h';
    const ref = db.ref('Posts').child(postId);
    ref.once('value', (snapshot) => {
        const postData = snapshot.val();
        if (postData) {
            res.json(postData);
        } else {
            res.status(404).send('Post not found');
        }
    }, (error) => {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    });
});


// router.get('/all',(req,res)=>{
//     const { db } = req;

//     const ref = db.ref('Posts');
//     ref.once('value', (snapshot) => {
//       console.log(snapshot.val());
//       res.send(snapshot.val())
//     });


   
//   })
router.get('/all', (req, res) => {
    const { db } = req;
    const ref = db.ref('Posts');

    ref.once('value')
        .then(snapshot => {
            const data = snapshot.val();

            // console.log('Data fetched from Firebase:', data);

            if (data) {
                const dataArray = Object.values(data);
                // console.log('Array of all children:', dataArray);
                res.json(dataArray);
            } else {
                // console.log('No data found under Posts');
                res.status(404).send('No data found');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        });
});

module.exports = router;