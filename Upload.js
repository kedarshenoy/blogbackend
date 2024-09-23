// const express = require("express");
// const admin = require('firebase-admin');
// const uuid = require('uuid-v4'); // Ensure uuid is imported
// const multer = require('multer'); // Ensure multer is imported
// const router = express.Router();
// const authenticateToken = require('./authenticateToken');

// // Initialize bucket and db
// const bucket = admin.storage().bucket();
// const db = admin.database(); // Initialize db if not done already

// // Set up multer memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // POST route to handle file uploads and content
// router.post('/', authenticateToken, upload.any(), async (req, res) => {
//   const documentContent = [];
//   const user = req.user; // Get user from request
  
//   const allKeys = [...Object.keys(req.body), ...(req.files || []).map(file => file.fieldname)];

//   // Sort the keys to ensure the correct order is maintained
//   allKeys.sort((a, b) => {
//     const indexA = parseInt(a.split('_')[1], 10);
//     const indexB = parseInt(b.split('_')[1], 10);
//     return indexA - indexB;
//   });

//   const uploadFile = async (file) => {
//     const metadata = {
//       metadata: {
//         firebaseStorageDownloadTokens: uuid(),
//       },
//       contentType: file.mimetype,
//       cacheControl: 'public, max-age=31536000',
//     };

//     const blob = bucket.file(file.originalname);
//     const blobStream = blob.createWriteStream({
//       metadata: metadata,
//       gzip: true,
//     });

//     return new Promise((resolve, reject) => {
//       blobStream.on('error', (err) => reject(err));

//       blobStream.on('finish', async () => {
//         // Get a signed URL for the file
//         const [url] = await blob.getSignedUrl({
//           action: 'read',
//           expires: '03-09-2491', // Set expiration date for the signed URL
//         });
//         resolve({ fieldname: file.fieldname, fileURL: url });
//       });

//       blobStream.end(file.buffer);
//     });
//   };

//   try {
//     for (const key of allKeys) {
//       if (req.body[key]) {
//         // Handle content
//         if (key.startsWith('content_')) {
//           const contentItem = JSON.parse(req.body[key]);
//           documentContent.push(contentItem);
//         }
//       } else {
//         // Handle files
//         const file = req.files.find(f => f.fieldname === key);
//         if (file) {
//           const uploadedFile = await uploadFile(file);
//           documentContent.push({
//             type: 'image',
//             url: uploadedFile.fileURL, // Updated field name
//             fileName: key,
//           });
//         }
//       }
//     }

//     // Include the user in the saved content
//     const postData = {
//       user: user.username,
//       content: documentContent, // Store the content
//       timestamp: new Date().toISOString(), // Optional: add a timestamp
//     };

//     const ref = db.ref('Posts');
//     const newUserRef = ref.push();
//     await newUserRef.set(postData);

//     res.json({ message: 'Data saved successfully.' });
//     console.log('Data saved successfully.');
//   } catch (error) {
//     res.status(500).json({ error: 'Error saving data.' });
//     console.error('Error saving data:', error);
//   }
// });


function calculateReadingTime(json) {
  const wordsPerMinute = 200; 
  let text = "";

  for (let key in json) {
    if (typeof json[key] === 'string') {
      text += json[key] + " ";  
    }
  }


  const wordCount = text.trim().split(/\s+/).length;

  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return readingTime;
}
