const express = require('express');
const cors = require('express');
const path = require('path');

const app = express();
app.use(cors());

const PORT = 80;

app.use('/', express.static(path.join(__dirname, 'client')));

const indexPath = path.join(__dirname, 'client', 'index.html');

app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

app.listen(PORT, () =>
  console.log(`Static server has been started on port ${PORT}...`)
);
