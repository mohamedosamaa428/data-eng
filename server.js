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

// Serve CSV files from public/data directory
app.use('/data', express.static(join(__dirname, 'public', 'data')));

// Serve static files from the Vite build output (dist folder)
// This will serve index.html for root path, and all JS/CSS assets
app.use(express.static(join(__dirname, 'dist')));

// Serve other public assets (if any)
app.use(express.static(join(__dirname, 'public')));

// Handle React Router - serve index.html for all routes that don't match static files
// This must be a catch-all that runs after static file serving
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // For all other routes (including /dashboard, /, etc.), serve index.html
  // This allows React Router to handle client-side routing
  res.sendFile(join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${join(__dirname, 'dist')}`);
});

