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


// router.get('/all', (req, res) => {
//     const { db } = req;
//     const ref = db.ref('Posts');

//     ref.once('value')
//         .then(snapshot => {
//             const data = snapshot.val();

//             // console.log('Data fetched from Firebase:', data);

//             if (data) {
//                 const dataArray = Object.values(data);
//                 res.json(dataArray);
//             } else {
//                 res.status(404).send('No data found');
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//             res.status(500).send('Internal Server Error');
//         });
// });

// router.get('/all', (req, res) => {
//     const { db } = req;
//     const refPosts = db.ref('Posts');
//     const refUsers = db.ref('users');

//     // Fetch posts first
//     refPosts.once('value')
//         .then(snapshotPosts => {
//             const postsData = snapshotPosts.val();

//             if (!postsData) {
//                 return res.status(404).send('No posts found');
//             }

//             const postsArray = Object.values(postsData);

//             // Fetch users data
//             return refUsers.once('value').then(snapshotUsers => {
//                 const usersData = snapshotUsers.val();

//                 if (!usersData) {
//                     return res.status(404).send('No users found');
//                 }

//                 // Create a map of users by email for faster lookup
//                 const usersMap = Object.values(usersData).reduce((acc, user) => {
//                     acc[user.email] = user;
//                     return acc;
//                 }, {});

//                 // Iterate over posts and add the corresponding userName while excluding 'user' and 'timestamp'
//                 const response = postsArray.map(post => {
//                     const { user, timestamp, ...rest } = post;  // Exclude 'user' and 'timestamp'
//                     const currentUser = usersMap[user];  // Find user by email

//                     return {
//                         ...rest,
//                         userName: currentUser ? currentUser.name : 'Unknown User'  // Add user's name or 'Unknown User' if not found
//                     };
//                 });

//                 // Return the modified posts
//                 res.json(response);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//             res.status(500).send('Internal Server Error');
//         });
// });




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


// router.get('/search', (req, res) => {
//     const { db } = req;
//     const { query } = req.query;  
//     const ref = db.ref('Posts');

//     ref.once('value')
//         .then(snapshot => {
//             const data = snapshot.val();

//             if (data) {
//                 const dataArray = Object.values(data);

//                 // Filter the posts based on the search query in title, heading, or subheading
//                 const filteredPosts = dataArray.filter(post => {
//                     const contentArray = post.content;

//                     // Ensure contentArray exists and is an array
//                     if (Array.isArray(contentArray) && contentArray.length > 0) {
//                         const title = contentArray.find(item => item.type === 'PostTitle')?.text;
//                         const heading = contentArray.find(item => item.type === 'heading')?.text;
//                         const subheading = contentArray.find(item => item.type === 'subheading')?.text;

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


router.get('/all', (req, res) => {
    const { db } = req;
    const refPosts = db.ref('Posts');
    const refUsers = db.ref('users');

    // Get pagination parameters from the request query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startAt = (page - 1) * limit;

    // Fetch posts
    refPosts.once('value')
        .then(snapshotPosts => {
            const postsData = snapshotPosts.val();

            if (!postsData) {
                return res.status(404).send('No posts found');
            }

            const postsArray = Object.values(postsData);

            // Calculate the total number of posts
            const totalPosts = postsArray.length;

            // Paginate posts
            const paginatedPosts = postsArray.slice(startAt, startAt + limit);

            // Fetch users data
            return refUsers.once('value').then(snapshotUsers => {
                const usersData = snapshotUsers.val();

                if (!usersData) {
                    return res.status(404).send('No users found');
                }

                // Create a map of users by email
                const usersMap = Object.values(usersData).reduce((acc, user) => {
                    acc[user.email] = user;
                    return acc;
                }, {});

                // Iterate over posts and add userName
                const response = paginatedPosts.map(post => {
                    const { user, timestamp, ...rest } = post;
                    const currentUser = usersMap[user];

                    return {
                        ...rest,
                        userName: currentUser ? currentUser.name : 'Unknown User'
                    };
                });

                // Return paginated posts and total post count
                res.json({
                    posts: response,
                    total: totalPosts
                });
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        });
});



// router.get('/search', (req, res) => {
//     const { db } = req;
//     const { query } = req.query;  
//     const refPosts = db.ref('Posts');
//     const refUsers = db.ref('users');

//     // Fetch posts first
//     refPosts.once('value')
//         .then(snapshotPosts => {
//             const postsData = snapshotPosts.val();

//             if (!postsData) {
//                 return res.status(404).send('No posts found');
//             }

//             const postsArray = Object.values(postsData);

//             // Fetch users data
//             return refUsers.once('value').then(snapshotUsers => {
//                 const usersData = snapshotUsers.val();

//                 if (!usersData) {
//                     return res.status(404).send('No users found');
//                 }

//                 // Create a map of users by email for faster lookup
//                 const usersMap = Object.values(usersData).reduce((acc, user) => {
//                     acc[user.email] = user;
//                     return acc;
//                 }, {});

//                 // Filter the posts based on the search query in title, heading, or subheading
//                 const filteredPosts = postsArray.filter(post => {
//                     const contentArray = post.content;

//                     // Ensure contentArray exists and is an array
//                     if (Array.isArray(contentArray) && contentArray.length > 0) {
//                         const title = contentArray.find(item => item.type === 'PostTitle')?.text;
//                         const heading = contentArray.find(item => item.type === 'heading')?.text;
//                         const subheading = contentArray.find(item => item.type === 'subheading')?.text;

//                         // Check if the search query matches title, heading, or subheading
//                         return (
//                             (title && title.toLowerCase().includes(query.toLowerCase())) ||
//                             (heading && heading.toLowerCase().includes(query.toLowerCase())) ||
//                             (subheading && subheading.toLowerCase().includes(query.toLowerCase()))
//                         );
//                     }
//                     return false;
//                 });

//                 // Iterate over filtered posts and add userName, while excluding 'user' and 'timestamp'
//                 const response = filteredPosts.map(post => {
//                     const { user, timestamp, ...rest } = post;  // Exclude 'user' and 'timestamp'
//                     const currentUser = usersMap[user];  // Find user by email

//                     return {
//                         ...rest,
//                         userName: currentUser ? currentUser.name : 'Unknown User'  // Add user's name or 'Unknown User' if not found
//                     };
//                 });

//                 // Return the filtered posts with the user's name and without 'user' and 'timestamp'
//                 res.json(response);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//             res.status(500).send('Internal Server Error');
//         });
// });



// router.get('/user-posts',authenticateToken, (req, res) => {
//     const { db } = req;
//     const username = req.user.username;  // Extract the username (email) from req.user
//     const refPosts = db.ref('Posts');
//     const refUsers = db.ref('users');

//     // Fetch posts first
//     refPosts.once('value')
//         .then(snapshotPosts => {
//             const postsData = snapshotPosts.val();

//             if (!postsData) {
//                 return res.status(404).send('No posts found');
//             }

//             const postsArray = Object.values(postsData);

//             // Filter posts by matching the username with the post's 'user' field (email)
//             const userPosts = postsArray.filter(post => post.user === username);

//             // Fetch users data
//             return refUsers.once('value').then(snapshotUsers => {
//                 const usersData = snapshotUsers.val();

//                 if (!usersData) {
//                     return res.status(404).send('No users found');
//                 }

//                 // Find the user object that matches the current username (email)
//                 const currentUser = Object.values(usersData).find(user => user.email === username);

//                 if (!currentUser) {
//                     return res.status(404).send('User not found');
//                 }

//                 // Add the user's name to each post in the response
//                 const response = userPosts.map(post => ({
//                     ...post,
//                     userName: currentUser.name  // Add user's name from 'users' collection
//                 }));

//                 // Return the modified posts with the user's name
//                 res.json(response);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//             res.status(500).send('Internal Server Error');
//         });
// });


router.get('/search', (req, res) => {
    const { db } = req;
    const { query, limit = 10, offset = 0 } = req.query;  // Add limit and offset for pagination
    const refPosts = db.ref('Posts');
    const refUsers = db.ref('users');

    // Fetch posts from the database
    refPosts.once('value')
        .then(snapshotPosts => {
            const postsData = snapshotPosts.val();

            if (!postsData) {
                return res.status(404).send('No posts found');
            }

            const postsArray = Object.values(postsData);

            // Fetch users data for matching user names
            return refUsers.once('value').then(snapshotUsers => {
                const usersData = snapshotUsers.val();

                if (!usersData) {
                    return res.status(404).send('No users found');
                }

                // Create a map of users by email for faster lookup
                const usersMap = Object.values(usersData).reduce((acc, user) => {
                    acc[user.email] = user;
                    return acc;
                }, {});

                // If a query is provided, filter posts based on the query
                let filteredPosts = postsArray;

                if (query) {
                    filteredPosts = postsArray.filter(post => {
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
                }

                // Pagination: limit the results and add an offset
                const paginatedPosts = filteredPosts.slice(Number(offset), Number(offset) + Number(limit));

                // Add the userName to each post and exclude 'user' and 'timestamp'
                const response = paginatedPosts.map(post => {
                    const { user, timestamp, ...rest } = post;  // Exclude 'user' and 'timestamp'
                    const currentUser = usersMap[user];  // Find user by email

                    return {
                        ...rest,
                        userName: currentUser ? currentUser.name : 'Unknown User'  // Add user's name or 'Unknown User' if not found
                    };
                });

                // Return the paginated and filtered posts
                res.json(response);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        });
});

router.get('/user-posts', authenticateToken, (req, res) => {
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

                // Add the user's name to each post in the response, excluding 'user' and 'timestamp'
                const response = userPosts.map(post => {
                    const { user, timestamp, ...rest } = post; // Exclude 'user' and 'timestamp'
                    return {
                        ...rest,
                        userName: currentUser.name  // Add user's name from 'users' collection
                    };
                });

                // Return the modified posts with the user's name and without 'user' and 'timestamp'
                res.json(response);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        });
});


router.post('/posts-creator', (req, res) => {
    const { db } = req;
    const {creatorName} = req.body; 
    const refPosts = db.ref('Posts');
    const refUsers = db.ref('users');

    // Fetch users to find the email of the creator
    refUsers.once('value')
        .then(snapshotUsers => {
            const usersData = snapshotUsers.val();

            if (!usersData) {
                return res.status(404).send('No users found');
            }

            // Find the user object that matches the creator's name
            const creatorUser = Object.values(usersData).find(user => user.name === creatorName);

            if (!creatorUser) {
                return res.status(404).send('Creator not found');
            }

            // Use the email of the creator as the username
            const username = creatorUser.email;

            // Fetch posts
            return refPosts.once('value').then(snapshotPosts => {
                const postsData = snapshotPosts.val();

                if (!postsData) {
                    return res.status(404).send('No posts found');
                }

                const postsArray = Object.values(postsData);

                // Filter posts by the creator's email (username)
                const userPosts = postsArray.filter(post => post.user === username);

                // Format response with the creator's name in each post
                const response = userPosts.map(post => {
                    const { user, timestamp, ...rest } = post;  // Exclude 'user' and 'timestamp'
                    return {
                        ...rest,
                        userName: creatorUser.name  // Add the creator's name to each post
                    };
                });

                // Return the filtered posts with creator's name
                res.json(response);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        });
});



module.exports = router;