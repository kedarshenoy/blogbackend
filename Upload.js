// need to move all uploads routes here



router.post('/upload',authenticateToken, upload.any(), async (req, res) => {
    const documentContent = [];
    const allKeys = [...Object.keys(req.body), ...(req.files || []).map(file => file.fieldname)];
  
    // Sort the keys to ensure the correct order is maintained
    allKeys.sort((a, b) => {
      const indexA = parseInt(a.split('_')[1], 10);
      const indexB = parseInt(b.split('_')[1], 10);
      return indexA - indexB;
    });
  
    const uploadFile = async (file) => {
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
  
      return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => reject(err));
  
        blobStream.on('finish', async () => {
          // Get a signed URL for the file
          const [url] = await blob.getSignedUrl({
            action: 'read',
            expires: '03-09-2491', // Set expiration date for the signed URL
          });
          resolve({ fieldname: file.fieldname, fileURL: url });
        });
  
        blobStream.end(file.buffer);
      });
    };
  
    try {
      for (const key of allKeys) {
        if (req.body[key]) {
          // Handle content
          if (key.startsWith('content_')) {
            const contentItem = JSON.parse(req.body[key]);
            documentContent.push(contentItem);
          }
        } else {
          // Handle files
          const file = req.files.find(f => f.fieldname === key);
          if (file) {
            const uploadedFile = await uploadFile(file);
            documentContent.push({
              type: 'image',
              url: uploadedFile.fileURL, // Updated field name
              fileName: key,
            });
          }
        }
      }
  
      const ref = db.ref('Posts');
      const newUserRef = ref.push();
      await newUserRef.set(documentContent);
  
      res.json({ message: 'Data saved successfully.' });
      console.log('Data saved successfully.');
    } catch (error) {
      res.status(500).json({ error: 'Error saving data.' });
      console.error('Error saving data:', error);
    }
  });
  