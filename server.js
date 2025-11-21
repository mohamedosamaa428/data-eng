import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve CSV files from public/data directory (before static files)
app.use('/data', express.static(join(__dirname, 'public', 'data')));

// Serve static files from the Vite build output (dist folder)
app.use(express.static(join(__dirname, 'dist')));

// Serve other public assets
app.use(express.static(join(__dirname, 'public')));

// Handle React Router - serve index.html for all routes that don't match static files
// Express 5 compatible catch-all route
app.use((req, res, next) => {
  // If request is for an API route or data file, skip
  if (req.path.startsWith('/data/') || req.path.startsWith('/api/')) {
    return next();
  }
  // Otherwise, serve index.html for SPA routing
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${join(__dirname, 'dist')}`);
});

