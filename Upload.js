// need to move all uploads routes here



router.post('/upload', upload.any(), async (req, res) => {
    const documentContent = [];
    const allKeys = [...Object.keys(req.body), ...(req.files || []).map(file => file.fieldname)];
  
    // Sort the keys to ensure the correct order is maintained
    allKeys.sort((a, b) => {
        const indexA = parseInt(a.split('_')[1], 10);
        const indexB = parseInt(b.split('_')[1], 10);
        return indexA - indexB;
    });
  
    const uploadFile = (file) => {
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
  
            blobStream.on('finish', () => {
                const imageURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                resolve({ fieldname: file.fieldname, imageURL });
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
                        url: uploadedFile.imageURL,
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