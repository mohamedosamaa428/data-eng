# Data Engineering Project
 📘 Data Engineering Project

A React + Vite** dashboard application for data visualization and analytics**, built using the NYC Motor Vehicle Collisions dataset**.  
This project includes a full frontend dashboard, interactive filters, 10 research questions, dynamic Plotly charts, and a full data-cleaning workflow delivered via Google Colab.

---

 🚀 Tech Stack

Frontend:
- React 19 — UI Library
- Vite 7 — Fast build tool & dev server
- Tailwind CSS 3.4 — Utility-first styling
- React Router DOM — Navigation
- Plotly.js + React Plotly.js — Interactive charts
- Axios — API client
- PapaParse — CSV parsing in browser

Backend:
- Express.js 5 — Node.js web server
- CORS — Cross-origin resource sharing
- csv-parser — Server-side CSV processing

Deployment:
- Render — Cloud hosting platform
    

---

 📂 Project Structure

```
data-eng/
├── public/
│   └── data/
│       └── merged_crashes_sampled.csv  # Main dataset
├── root/
│   └── server.js                       # Express server
├── src/
│   ├── charts/                         # Chart components
│   │   ├── BasePlot.jsx
│   │   ├── BoroughHotspotRankingChart.jsx
│   │   ├── BoroughInjuryFatalityBubbleChart.jsx
│   │   └── index.js
│   ├── components/
│   │   ├── charts/                     # Placeholder components
│   │   │   ├── BarChartPlaceholder.jsx
│   │   │   ├── HeatmapPlaceholder.jsx
│   │   │   ├── LineChartPlaceholder.jsx
│   │   │   ├── MapChartPlaceholder.jsx
│   │   │   ├── PieChartPlaceholder.jsx
│   │   │   └── index.js
│   │   ├── filters/                     # Filter dropdown components
│   │   │   ├── BoroughDropdown.jsx
│   │   │   ├── ContributingFactorDropdown.jsx
│   │   │   ├── InjuryTypeDropdown.jsx
│   │   │   ├── VehicleTypeDropdown.jsx
│   │   │   ├── YearDropdown.jsx
│   │   │   └── index.js
│   │   ├── FiltersPanel.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx                # Natural language search
│   │   ├── Sidebar.jsx
│   │   └── VisualizationsPanel.jsx
│   ├── layout/
│   │   └── MainLayout.jsx               # Main page layout
│   ├── pages/
│   │   └── VisualizationsPage.jsx       # Main dashboard page
│   ├── utils/
│   │   ├── dataProcessing.js            # Data transformation functions
│   │   └── dataProcessors.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── utils/
│   └── searchParser.js                  # Natural language query parser
├── NoteBook/
│   └── data_engineering_project_collab_part_final.ipynb
├── server.js                            # Production server entry
├── package.json
├── vite.config.js
└── render.yaml                          # Render deployment config
```

---

# 🧑‍💻 Team Members & Responsibilities

Person 1 — Seif Allah**

Role: Frontend Setup + Layout Structure

- Created React project
    
- Installed all dependencies
    
- Built layout (Navbar, Sidebar, filters section, charts section)
    
- Styled UI using Tailwind
    
- Created all filter UI components
    
- Created placeholder chart components
    

---

Person 2 — Ahmed Walid

Role: Backend (Flask/Node) + Data API + Integration

- Built the backend API
    
- Implemented filtering logic
    
- Created `/filters` and `/data` endpoints
    
- Added search-mode parsing
    
- Deployed backend on Render
    

---

Person 3 — Mohamed Osama

Role: Charts & Interactive Plotly Visualizations

- Created all Plotly.js charts
    
- Integrated charts with React props
    
- Implemented responsiveness & hover interactions
    
- Handled dynamic chart updates
    

---

Person 4 — Mahmoud Amr

Role:State Management + Filter Logic + Search Mode

- Implemented global state with React Context
    
- Built interactive filters
    
- Connected filters to charts
    
- Implemented Search Mode
    
- Implemented “Generate Report” button
    
- Data fetching + synchronization
    

---

Person 5 — Abdelrahman Mousa

Role:Data Cleaning + EDA + Integration Notebook

- Full Google Colab notebook
    
- Dataset exploration & missing value analysis
    
- Pre-cleaning, cleaning, outlier handling
    
- Dataset integration (Crashes + Persons)
    
- Performance optimization (5%, 10%, 20% samples)
    
- Created final cleaned dataset used in website
    

Notebook link:  
[https://colab.research.google.com/drive/1YRUGHEbT9K8JuHZ2m55AR3JRR3RRFmxl?usp=sharing](https://colab.research.google.com/drive/1YRUGHEbT9K8JuHZ2m55AR3JRR3RRFmxl?usp=sharing)

---

📝 Research Questions + Team Member Attributions


1️⃣ Research Question — Bar Chart

Team Member: Mohamed Osama  
Question:Which borough has the highest number of collisions?

2️⃣ Research Question — Bar Chart

Team Member: Seif Mohamed  
Question:What are the top 10 contributing factors that cause collisions?

3️⃣ Research Question — Line Chart

Team Member: Mahmoud Amr  
Question:How do collisions change month-by-month over the years?

4️⃣ Research Question — Line Chart

Team Member:Ahmed Walid  
Question:How do collisions change during the hours of the day?

5️⃣ Research Question — Pie Chart

Team Member:Abdelrahman Mousa  
Question:What percentage of collisions involve each type of vehicle?

6️⃣ Research Question — Pie Chart

Team Member:Mohamed Osama  
Question:What share does each borough contribute to total collisions?

7️⃣ Research Question — Heatmap

Team Member:Seif Mohamed  
Question:At what hour and on what day of the week do collisions happen the most?

8️⃣ Research Question — Heatmap

Team Member:Mahmoud Amr  
Question:Which combinations of vehicle type and contributing factor appear together most often?

9️⃣ Research Question — Bar Chart

Team Member:Ahmed Walid  
Question:Where are collision hotspots located across NYC?

🔟 Research Question — Bubble Chart

Team Member:Abdelrahman Mousa  
Question:Which boroughs have the highest injury and fatality locations?


# 📊 Dataset Information

1. Crashes Dataset

📌 Source: NYC OpenData  
📥 Download: [https://data.cityofnewyork.us/api/views/h9gi-nx95/rows.csv?accessType=DOWNLOAD](https://data.cityofnewyork.us/api/views/h9gi-nx95/rows.csv?accessType=DOWNLOAD)

- Original Rows:2,221,559
    
- Original Columns:29
    
- Cleaned Rows:1,680,445

- Cleaned Columns:25
    
- Date Range:2012-07-01 → 2024-02-29
    

Important fields:

- CRASH DATE / TIME
    
- BOROUGH
    
- LATITUDE, LONGITUDE
    
- CONTRIBUTING FACTOR VEHICLE 1–5
    
- VEHICLE TYPE CODE 1–5
    
- NUMBER OF PERSONS INJURED/KILLED
    
- COLLISION_ID
    

---

2. Persons Dataset

📌 Source: NYC OpenData  
📥 Download: [https://data.cityofnewyork.us/api/views/f55k-p6yu/rows.csv?accessType=DOWNLOAD](https://data.cityofnewyork.us/api/views/f55k-p6yu/rows.csv?accessType=DOWNLOAD)

- Rows:5,823,480
    
- Columns:21
    

Important fields:

- PERSON_TYPE
    
- PERSON_INJURY
    
- PERSON_AGE / SEX
    
- VEHICLE_ID
    
- CONTRIBUTING FACTOR 1–2
    
- POSITION IN VEHICLE
    
- Safety-related columns
    

---

# 🧪 Performance Comparison (Sampling)

|Version|Rows|Size|Load Time|Best For|
|---|---|---|---|---|
|Full dataset|1.68M|366 MB|2–5 min|❌ Too slow for web|
|20% sample|336k|73 MB|30–60 sec|⚠️ Borderline|
|10% sample|168k|36 MB|10–20 sec|✅ Best for dashboard|
|5% sample|84k|18 MB|5–10 sec|✔ Very fast|

---

# 🌐 Deployment

Frontend Deployment

🚀 Fully deployed using Render  
🔗 Live URL:[https://data-eng.onrender.com](https://data-eng.onrender.com/)

Status:  
✔ Fully functional  
✔ All filters working  
✔ All charts dynamic  
✔ Search mode operational  
✔ Responsive and mobile-friendly

Key Features:
- 🔍 Natural Language Search — Search queries like "Brooklyn 2022 pedestrian crashes"
- 📊 10 Interactive Charts — Bar charts, line charts, pie charts, heatmaps, and bubble charts
- 🎯 Advanced Filtering — Filter by borough, year, vehicle type, contributing factor, and injury type
- 📈 Dynamic Data Updates — All charts update in real-time based on filters
- 📥 Chart Export— Download, zoom, and interact with all visualizations
- 📱 Responsive Design — Works seamlessly on desktop, tablet, and mobile devices
- 🔄 Generate Report — Create filtered reports with one click

---

🛠 Installation

Prerequisites

- Node.js 18+
    
- npm or yarn
    

 Steps

```bash
git clone https://github.com/mohamedosamaa428/data-eng.git
cd data-eng
npm install
npm run dev
```

Then visit:

```
http://localhost:5173
```

---

 🧾 Available Scripts

- `npm run dev` — Start development server (Vite)
- `npm run build` — Build for production
- `npm run preview` — Preview final build locally
- `npm start` — Start production server (Express)
- `npm run server` — Start development server with nodemon
- `npm run lint` — Run ESLint
    

---

📍 Routes

- `/` — Redirects to `/dashboard`
- `/dashboard` — Main visualization dashboard with all 10 research questions

API Endpoints (Backend):
- `/data` — Get filtered collision data
- `/data/merged_crashes_sampled.csv` — Direct CSV file access
    

---

 📘 Notebook Overview (What the Colab Contains)

Data Cleaning Pipeline:
- Dataset loading (Crashes + Persons datasets)
- Initial inspection (info, describe, shape analysis)
- Missing value analysis and visualization
- Null-value thresholds (>50% dropped columns)
- Date parsing & type conversions
- Outlier detection and handling
- Category normalization and standardization
- Data integration using `COLLISION_ID` as primary key
- Post-integration cleaning and validation
- Final dataset export (CSV / Parquet formats)
- Performance optimization with sampling (5%, 10%, 20%)

Notebook Features:
- Comprehensive EDA (Exploratory Data Analysis)
- Data quality assessment
- Statistical summaries
- Visualizations for data understanding
- Code documentation and markdown explanations
    

---

 📄 License

MIT License
