# Data Engineering Project

A React + Vite dashboard application for data visualization and analytics.

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Plotly.js** - Interactive charting library
- **React Plotly.js** - React wrapper for Plotly
- **Axios** - HTTP client

## Features

- 📊 Interactive dashboard with multiple chart visualizations
- 🔍 Filter panel with multiple filter options (Borough, Year, Vehicle Type, Contributing Factor, Injury Type)
- 📱 Responsive design for desktop and mobile
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── filters/     # Filter dropdown components
│   ├── charts/      # Chart placeholder components
│   ├── FiltersPanel.jsx
│   ├── Navbar.jsx
│   └── Sidebar.jsx
├── layout/          # Layout components
│   └── MainLayout.jsx
├── pages/           # Page components
│   └── VisualizationsPage.jsx
├── hooks/           # Custom React hooks
├── styles/          # Additional stylesheets
├── App.jsx          # Main App component
└── main.jsx         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mohamedosamaa428/data-eng.git
cd data-eng
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Routes

- `/dashboard` - Main dashboard page with filters and visualizations

## Current Status

This is a frontend-only implementation with placeholder components. All components are UI-only with no backend connections or data logic yet.

## License

MIT
