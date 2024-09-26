router.post('/upload', authenticateToken, upload.any(), async (req, res) => {
  const documentContent = [];
  const user = req.user; // Get user from request
  
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

  // Function to calculate reading time based on post content
  function calculateReadingTime(json) {
    const wordsPerMinute = 200; 
    let text = "";

    // Extract text content from the documentContent array
    for (let key in json) {
      if (typeof json[key] === 'string') {
        text += json[key] + " ";  
      }
    }

    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    return readingTime;
  }

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

    // Calculate reading time from document content
    const readingTime = calculateReadingTime(documentContent);

    // Create formatted date in the format "Time: Sep-9-2024"
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = `Time: ${currentDate.toLocaleDateString('en-US', options)}`;

    // Include the user, formatted date, and reading time in the saved content
    const postData = {
      user: user.username,
      content: documentContent, // Store the content
      formattedTime: formattedDate, // Add the formatted time
      readingTime: ` ${readingTime} ${readingTime >1 ? "minutes":"minute"}`,
    };

    const ref = db.ref('Posts');
    const newUserRef = ref.push();
    await newUserRef.set(postData);

    res.json({ message: 'Data saved successfully.' });
    console.log('Data saved successfully.');
  } catch (error) {
    res.status(500).json({ error: 'Error saving data.' });
    console.error('Error saving data:', error);
  }
});
