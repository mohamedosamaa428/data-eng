/*

  Chart Type: Map Visualization

  Research Question:

  - Where are collision hotspots located across NYC?

*/

import { useState, useEffect, useMemo } from 'react'
import BasePlot from './BasePlot'

const MAPBOX_TOKEN =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_MAPBOX_TOKEN) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_MAPBOX_TOKEN) ||
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndjJ6b3Z3N3gifQ.tCP2II7uXx1JrcI4tyoLJQ'

function CrashMap({ data = [], title = 'Crash Map' }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [layout, setLayout] = useState({})
  const [isVisible, setIsVisible] = useState(true)

  // Memoize color function to prevent recreation
  const getSeverityColor = useMemo(() => (severity) => {
    if (typeof severity === 'number') {
      // Numeric severity: use color scale from green (low) to red (high)
      if (severity <= 1) return '#10b981' // green
      if (severity <= 2) return '#f59e0b' // amber
      if (severity <= 3) return '#f97316' // orange
      return '#ef4444' // red
    }
    
    // Categorical severity
    const severityStr = String(severity).toLowerCase()
    if (severityStr.includes('low') || severityStr.includes('minor')) return '#10b981'
    if (severityStr.includes('medium') || severityStr.includes('moderate')) return '#f59e0b'
    if (severityStr.includes('high') || severityStr.includes('major')) return '#f97316'
    if (severityStr.includes('fatal') || severityStr.includes('severe')) return '#ef4444'
    return '#3b82f6' // default blue
  }, [])

  // Transform data when props change
  useEffect(() => {
    if (!data || data.length === 0) {
      setPlotlyData([])
      setLayout({})
      return
    }

    // Fade out, update, then fade in
    setIsVisible(false)
    
    const timer = setTimeout(() => {
      // Filter and process data - remove invalid coordinates
      const processedData = data
        .map(item => {
          const lat = Number(item.latitude ?? item.Latitude)
          const lon = Number(item.longitude ?? item.Longitude)
          if (
            Number.isNaN(lat) ||
            Number.isNaN(lon) ||
            lat < 40 ||
            lat > 41 ||
            lon < -75 ||
            lon > -73
          ) {
            return null
          }

          return {
            latitude: lat,
            longitude: lon,
            severity: item.severity || item.Severity || 'Unknown',
            borough: item.borough || item.Borough || 'Unknown',
            date: item.date || item.Date || item.crash_date || item.Crash_Date || 'Unknown',
            time: item.time || item.Time || item.crash_time || item.Crash_Time || 'Unknown',
            injuries:
              Number(item.injuries ||
                item.Injuries ||
                item.number_of_injured ||
                item.Number_of_Injured) || 0
          }
        })
        .filter(Boolean)

      if (processedData.length === 0) {
        setPlotlyData([])
        setLayout({})
        return
      }

      // Extract coordinates and metadata
      const lats = processedData.map(item => item.latitude)
      const lons = processedData.map(item => item.longitude)
      const severities = processedData.map(item => item.severity)
      
      const colors = severities.map(getSeverityColor)
      
      // Dynamic marker size based on data density (6-10 range)
      const markerSize = processedData.length > 1000 ? 6 : processedData.length > 500 ? 7 : 8

      // Create hover text
      const hoverTexts = processedData.map(item => {
        const dateTime = item.date !== 'Unknown' && item.time !== 'Unknown' 
          ? `${item.date} ${item.time}`
          : item.date !== 'Unknown' 
            ? item.date 
            : 'Date/Time Unknown'
        
        return `<b>${item.borough}</b><br>` +
               `Date/Time: ${dateTime}<br>` +
               `Injuries: ${item.injuries}<br>` +
               `Severity: ${item.severity}`
      })

      // Create Plotly trace for scatter mapbox
      const newPlotlyData = [
        {
          type: 'scattermapbox',
          lat: lats,
          lon: lons,
          mode: 'markers',
          marker: {
            size: markerSize,
            color: colors,
            opacity: 0.7,
            line: {
              color: '#ffffff',
              width: 0.5
            }
          },
          text: hoverTexts,
          hovertemplate: '%{text}<extra></extra>',
          hoverinfo: 'text'
        }
      ]

      // Calculate center point (NYC approximate center)
      const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length
      const centerLon = lons.reduce((a, b) => a + b, 0) / lons.length

      // Custom layout for Mapbox
      const newLayout = {
        mapbox: {
          style: 'open-street-map',
          accesstoken: MAPBOX_TOKEN,
          center: {
            lat: centerLat,
            lon: centerLon
          },
          zoom: 10, // NYC scale (9-11 range, using 10 as default)
          bearing: 0,
          pitch: 0
        },
        margin: {
          l: 0,
          r: 0,
          t: 60,
          b: 0,
          pad: 0
        },
        autosize: true,
        hovermode: 'closest'
      }

      setPlotlyData(newPlotlyData)
      setLayout(newLayout)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [data, getSeverityColor])

  // Handle empty data case
  if (!data || data.length === 0 || plotlyData.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  return (
    <div 
      className="w-full h-full transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <BasePlot
        title={title}
        data={plotlyData}
        layout={layout}
        config={{ mapboxAccessToken: MAPBOX_TOKEN }}
      />
    </div>
  )
}

export default CrashMap

