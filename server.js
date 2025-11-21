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

// Serve static files from the Vite build output (dist folder)
app.use(express.static(join(__dirname, 'dist')));

// Serve CSV files from public/data directory
app.use('/data', express.static(join(__dirname, 'public', 'data')));

// Serve other public assets
app.use(express.static(join(__dirname, 'public')));

// Handle React Router - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${join(__dirname, 'dist')}`);
});

