# Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

## Deployment Steps

### Step 1: Prepare Your Repository
1. Ensure all files are committed and pushed to GitHub
2. Verify the following files exist:
   - `server.js` (in root directory)
   - `package.json` (with build and start scripts)
   - `render.yaml` (optional, for automated setup)
   - `public/data/merged_crashes_sampled.csv` (your data file)

### Step 2: Create Render Web Service

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Sign up or log in

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `data-eng`

3. **Configure Service Settings**
   - **Name**: `data-eng-dashboard` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)

4. **Environment Variables** (if needed)
   - `NODE_ENV`: `production`
   - Add any other environment variables your app needs

5. **Click "Create Web Service"**

### Step 3: Verify Deployment

1. **Wait for Build**
   - Render will install dependencies
   - Build the Vite app (creates `dist/` folder)
   - Start the server

2. **Check Logs**
   - View build logs in Render dashboard
   - Look for: "🚀 Server running on port XXXX"
   - Check for any errors

3. **Test Your Site**
   - Visit the provided URL (e.g., `https://data-eng-dashboard.onrender.com`)
   - Verify:
     - Homepage loads
     - CSV file loads (`/data/merged_crashes_sampled.csv`)
     - Charts render correctly
     - Filters work

### Step 4: Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain and follow DNS instructions

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### CSV File Not Loading
- Verify `public/data/merged_crashes_sampled.csv` exists
- Check file size (Render free tier has limits)
- Verify server.js serves `/data` route correctly

### App Crashes on Start
- Check server logs in Render dashboard
- Verify `server.js` is in root directory
- Ensure `dist/` folder is created after build

### 404 Errors
- Verify React Router catch-all route in `server.js`
- Check that `dist/index.html` exists after build

## File Structure Required

```
data-eng/
├── server.js          # Express server (serves frontend + CSV)
├── package.json       # Dependencies and scripts
├── render.yaml        # Render config (optional)
├── vite.config.js    # Vite build config
├── public/
│   └── data/
│       └── merged_crashes_sampled.csv
├── src/              # React source code
└── dist/             # Built files (created by npm run build)
```

## Important Notes

- **Free Tier Limitations**:
  - Services spin down after 15 minutes of inactivity
  - First request after spin-down may take 30-60 seconds
  - 750 hours/month free

- **File Size Limits**:
  - Free tier: 100MB total
  - Your CSV file is ~47MB, which is fine

- **Build Time**:
  - First build: 5-10 minutes
  - Subsequent builds: 2-5 minutes

## Alternative: Using render.yaml

If you created `render.yaml`, you can use Render's Blueprint feature:
1. In Render dashboard, click "New +" → "Blueprint"
2. Connect your repository
3. Render will auto-configure from `render.yaml`

