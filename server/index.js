const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'uploads')));

app.post('/api/upload', upload.fields([{ name: 'video' }, { name: 'audio' }]), (req, res) => {
  const videoPath = req.files['video'][0].path;
  const audioPath = req.files['audio'][0].path;
  const outputPath = path.join('uploads', 'output.mp4');

  ffmpeg()
    .addInput(videoPath)
    .addInput(audioPath)
    .saveToFile(outputPath)
    .on('end', () => {
      res.send({ message: 'Video created successfully!', path: outputPath });
    })
    .on('error', (err) => {
      res.status(500).send({ message: 'Error processing video', error: err });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
