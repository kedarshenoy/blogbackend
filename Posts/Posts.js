const express = require("express");
const router = express.Router();



router.get('/', (req, res) => {
    const { db } = req;
    const postId = '-O5dXs09xSEoYC487V9h';
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


module.exports = router;