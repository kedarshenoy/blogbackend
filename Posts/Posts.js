const express = require("express");
const router = express.Router();
const authenticateToken=require('../authenticateToken')

// router.post('/', (req, res) => {
//     const { db } = req;
//     const {postId} =req.body;
//     // const postId = '-O5dXs09xSEoYC487V9h';
//     const ref = db.ref('Posts').child(postId);
//     ref.once('value', (snapshot) => {
//         const postData = snapshot.val();
//         if (postData) {
//             res.json(postData);
//         } else {
//             res.status(404).send('Post not found');
//         }
//     }, (error) => {
//         console.error('Error fetching data:', error);
//         res.status(500).send('Error fetching data');
//     });
// });


router.get('/all', (req, res) => {
    const { db } = req;
    const ref = db.ref('Posts');

    ref.once('value')
        .then(snapshot => {
            const data = snapshot.val();

            // console.log('Data fetched from Firebase:', data);

            if (data) {
                const dataArray = Object.values(data);
                res.json(dataArray);
            } else {
                res.status(404).send('No data found');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        });
});





// router.get('/search',  (req, res) => {
//     const { db } = req;
//     const { query } = req.query;  // Extracting the search query from the URL
//     const ref = db.ref('Posts');

//     ref.once('value')
//         .then(snapshot => {
//             const data = snapshot.val();

//             if (data) {
//                 const dataArray = Object.values(data);

//                 // Filter the posts based on the search query in title, heading, or subheading
//                 const filteredPosts = dataArray.filter(post => {
//                     // Ensure post is an array and has content
//                     if (Array.isArray(post) && post.length > 0) {
//                         const title = post.find(item => item.type === 'PostTitle')?.text;
//                         const heading = post.find(item => item.type === 'heading')?.text;
//                         const subheading = post.find(item => item.type === 'subheading')?.text;

//                         // Check if the search query matches title, heading, or subheading
//                         return (
//                             (title && title.toLowerCase().includes(query.toLowerCase())) ||
//                             (heading && heading.toLowerCase().includes(query.toLowerCase())) ||
//                             (subheading && subheading.toLowerCase().includes(query.toLowerCase()))
//                         );
//                     }
//                     return false;
//                 });

//                 res.json(filteredPosts);
//             } else {
//                 res.status(404).send('No data found');
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//             res.status(500).send('Internal Server Error');
//         });
// });


router.get('/search', (req, res) => {
    const { db } = req;
    const { query } = req.query;  
    const ref = db.ref('Posts');

    ref.once('value')
        .then(snapshot => {
            const data = snapshot.val();

            if (data) {
                const dataArray = Object.values(data);

                // Filter the posts based on the search query in title, heading, or subheading
                const filteredPosts = dataArray.filter(post => {
                    const contentArray = post.content;

                    // Ensure contentArray exists and is an array
                    if (Array.isArray(contentArray) && contentArray.length > 0) {
                        const title = contentArray.find(item => item.type === 'PostTitle')?.text;
                        const heading = contentArray.find(item => item.type === 'heading')?.text;
                        const subheading = contentArray.find(item => item.type === 'subheading')?.text;

                        // Check if the search query matches title, heading, or subheading
                        return (
                            (title && title.toLowerCase().includes(query.toLowerCase())) ||
                            (heading && heading.toLowerCase().includes(query.toLowerCase())) ||
                            (subheading && subheading.toLowerCase().includes(query.toLowerCase()))
                        );
                    }
                    return false;
                });

                res.json(filteredPosts);
            } else {
                res.status(404).send('No data found');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        });
});



router.get('/user-posts',authenticateToken, (req, res) => {
    const { db } = req;
    const username = req.user.username;  // Extract the username (email) from req.user
    const refPosts = db.ref('Posts');
    const refUsers = db.ref('users');

    // Fetch posts first
    refPosts.once('value')
        .then(snapshotPosts => {
            const postsData = snapshotPosts.val();

            if (!postsData) {
                return res.status(404).send('No posts found');
            }

            const postsArray = Object.values(postsData);

            // Filter posts by matching the username with the post's 'user' field (email)
            const userPosts = postsArray.filter(post => post.user === username);

            // Fetch users data
            return refUsers.once('value').then(snapshotUsers => {
                const usersData = snapshotUsers.val();

                if (!usersData) {
                    return res.status(404).send('No users found');
                }

                // Find the user object that matches the current username (email)
                const currentUser = Object.values(usersData).find(user => user.email === username);

                if (!currentUser) {
                    return res.status(404).send('User not found');
                }

                // Add the user's name to each post in the response
                const response = userPosts.map(post => ({
                    ...post,
                    userName: currentUser.name  // Add user's name from 'users' collection
                }));

                // Return the modified posts with the user's name
                res.json(response);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        });
});


module.exports = router;