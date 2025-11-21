// server.js

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const parseQuery = require("./utils/searchParser");

const app = express();
app.use(cors());

let df = [];

// ---------------------------------------
// LOAD DATASET (.CSV) - using csv-parser
// ---------------------------------------
function loadDataset() {
  console.log("Loading CSV dataset...");
  const filePath = "data/final_dataset.csv";

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      // Optionally: convert numeric fields from string to number
      // e.g., row.YEAR = Number(row.YEAR);
      df.push(row);
    })
    .on("end", () => {
      console.log("CSV loaded successfully:", df.length, "rows");
    })
    .on("error", (err) => {
      console.error("Error reading CSV:", err);
    });
}

loadDataset();


// ---------------------------------------
// ENDPOINT: GET FILTER OPTIONS
// ---------------------------------------
app.get("/filters", (req, res) => {
  const unique = (col) => [...new Set(df.map(r => r[col]).filter(Boolean))];

  res.json({
    boroughs: unique("BOROUGH").sort(),
    years: unique("YEAR").sort((a, b) => a - b),
    vehicle_types: unique("VEHICLE_TYPE_CODE"),
    injury_types: unique("PERSON_INJURY"),
    factors: unique("CONTRIBUTING_FACTOR_VEHICLE_1"),
  });
});


// ---------------------------------------
// ENDPOINT: FILTERED DATA
// ---------------------------------------
app.get("/data", (req, res) => {
  let filtered = [...df];

  const { borough, year, vehicle, factor, injury } = req.query;

  if (borough) filtered = filtered.filter(r => r.BOROUGH === borough);
  if (year) filtered = filtered.filter(r => r.YEAR == year);
  if (vehicle) filtered = filtered.filter(r => r.VEHICLE_TYPE_CODE_1 === vehicle);
  if (factor) filtered = filtered.filter(r => r.CONTRIBUTING_FACTOR_VEHICLE_1 === factor);
  if (injury) filtered = filtered.filter(r => r.PERSON_INJURY === injury);

  // Limit the number of records returned to avoid overloading front-end
  res.json(filtered.slice(0, 5000));
});


// ---------------------------------------
// ENDPOINT: SEARCH MODE
// ---------------------------------------
// This is the corrected /search endpoint
app.get("/search", (req, res) => {
  const query = req.query.q ?? "";
  const params = parseQuery(query);

// console.log('Search Query Received:', query);
// console.log('Parsed Params from searchParser:', params);

  let filtered = [...df];

  // The fix: Apply .toUpperCase() to the parsed parameters before comparison
  if (params.borough) filtered = filtered.filter(r => r.BOROUGH === params.borough.toUpperCase());
  if (params.year) filtered = filtered.filter(r => r.YEAR == params.year);
  if (params.injury) filtered = filtered.filter(r => r.PERSON_INJURY === params.injury.toUpperCase());
  if (params.vehicle) filtered = filtered.filter(r => r.VEHICLE_TYPE_CODE_1 === params.vehicle.toUpperCase());

  res.json(filtered.slice(0, 5000));
});


// ---------------------------------------
// START SERVER
// ---------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
});
