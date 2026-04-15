const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const CANONICAL = 'bk.parfour.io';

app.use((req, res, next) => {
  const host = req.headers.host;
  const proto = req.headers['x-forwarded-proto'];

  // Redirect any non-canonical host → bk.parfour.io
  if (host && host !== CANONICAL) {
    return res.redirect(301, 'https://' + CANONICAL + req.url);
  }

  // Redirect HTTP → HTTPS
  if (proto === 'http') {
    return res.redirect(301, 'https://' + CANONICAL + req.url);
  }

  next();
});

// Serve static files
app.use(express.static(__dirname));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
