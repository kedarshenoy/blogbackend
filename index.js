const express = require('express');
const admin = require('firebase-admin');
const uuid = require('uuid-v4')
const app =express();
const multer = require('multer');
const path = require('path');
const port =5000;
const bodyParser = require('body-parser');
const cors=require('cors');
const Login = require('./Logins/Login');
const SignUp= require('./Logins/Signup');


app.use(cors());
app.use(bodyParser.json())
const router= express.Router()
app.use('/', router);

const db = admin.database();
const bucket =admin.storage().bucket();
const storage = multer.memoryStorage();
const upload =multer({storage:storage});

app.use('/login', (req, res, next) => {
  req.db = db; 
  Login(req, res, next);
});
app.use('/signup',(req,res,next)=>{
  req.db = db; 
  SignUp(req, res, next);
});
router.get('/',(req,res)=>{
    const ref = db.ref('Posts');
    ref.once('value', (snapshot) => {
      console.log(snapshot.val());
    });
res.send('working')

   
  })
  



  router.post('/upload', upload.any(), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }
  
    console.log(req.body);
    const documentContent = [];
    const fileUploadPromises = [];
  
    req.files.forEach((file, index) => {
      const metadata = {
        metadata: {
          firebaseStorageDownloadTokens: uuid(),
        },
        contentType: file.mimetype,
        cacheControl: 'public, max-age=31536000',
      };
  
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: metadata,
        gzip: true,
      });
  
      const uploadPromise = new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          reject(err);
        });
  
        blobStream.on('finish', () => {
          const imageURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve({ fieldname: file.fieldname, imageURL });
        });
  
        blobStream.end(file.buffer);
      });
  
      fileUploadPromises.push(uploadPromise);
    });
  
    Promise.all(fileUploadPromises)
      .then((uploadedFiles) => {
        uploadedFiles.forEach((uploadedFile) => {
          req.body[uploadedFile.fieldname] = uploadedFile.imageURL;
        });
  
        Object.keys(req.body).forEach((key) => {
          if (key.startsWith('content_')) {
            try {
              const contentItem = JSON.parse(req.body[key]);
              documentContent.push(contentItem);
            } catch (err) {
              console.error('Error parsing content:', err);
            }
          } else {
            documentContent.push({
              type: 'image',
              url: req.body[key],
              fileName: key,
            });
          }
        });
  
        console.log('Modified Request:', req.body);
  
        const ref = db.ref('Posts');
        const newUserRef = ref.push();
  
        newUserRef.set(documentContent)
          .then(() => {
            res.json({ message: 'Data saved successfully.' });
            console.log('Data saved successfully.');
          })
          .catch((error) => {
            res.status(500).json({ error: 'Error saving data.' });
            console.error('Error saving data:', error);
          });
      })
      .catch((err) => {
        console.error('Error uploading files:', err);
        res.status(500).json({ error: 'Failed to upload files.' });
      });
  });
  

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });