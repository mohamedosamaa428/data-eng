/*

  Chart Type: Line Chart

  Research Question:

  - How do collisions change month-by-month over the years?

*/

import { useState, useEffect, useMemo } from 'react'
import BasePlot from './BasePlot'

function YearLineChart({ data = [], title = 'Year Line Chart' }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  // Memoize layout to prevent unnecessary recalculations
  const layout = useMemo(() => ({
    xaxis: {
      title: {
        text: 'Date',
        font: { size: 14 }
      },
      type: 'category', // Treat dates as categories for better display
      gridcolor: '#e5e7eb',
      showgrid: true
    },
    yaxis: {
      title: {
        text: 'Count',
        font: { size: 14 }
      },
      gridcolor: '#e5e7eb',
      showgrid: true
    },
    hovermode: 'x unified'
  }), [])

  // Transform data when props change
  useEffect(() => {
    if (!data || data.length === 0) {
      setPlotlyData([])
      return
    }

    // Fade out, update, then fade in
    setIsVisible(false)
    
    const timer = setTimeout(() => {
      // Convert data array to Plotly format
      const dates = data.map(item => item.date || item.Date || '')
      const counts = data.map(item => item.count || item.Count || 0)

      // Create Plotly trace for smooth line chart with markers
      const newPlotlyData = [
        {
          type: 'scatter',
          mode: 'lines+markers',
          x: dates,
          y: counts,
          line: {
            color: '#3b82f6',
            width: 3,
            shape: 'spline' // Smooth curve
          },
          marker: {
            color: '#3b82f6',
            size: 8,
            line: {
              color: '#ffffff',
              width: 2
            }
          },
          hovertemplate: '<b>%{x}</b><br>Count: %{y:,.0f}<extra></extra>',
          hoverinfo: 'x+y',
          fill: 'none'
        }
      ]

      setPlotlyData(newPlotlyData)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [data])

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
      />
    </div>
  )
}

export default YearLineChart

