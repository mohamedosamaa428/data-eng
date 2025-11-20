/**
 * HeatmapHourlyDaily Component
 * 
 * Research Question: What are the peak hours and days for crashes?
 * 
 * Filter Combinations:
 * - Year: Filters crashes by year range
 * - Borough: Filters crashes by specific borough(s)
 * - Vehicle Type: Filters by vehicle types involved
 * - Contributing Factor: Filters by contributing factors
 * - Injury Type: Filters by severity of injuries
 * 
 * Expected Data Format from Backend:
 * [
 *   { hour: number (0-23), day: string ("Monday"-"Sunday"), count: number },
 *   ...
 * ]
 * 
 * Alternative field names supported: Hour, Day, Count
 * Day names are case-insensitive and matched to: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
 * 
 * Data is aggregated into a 7x24 matrix (days × hours) with counts summed for overlapping entries.
 */

import { useState, useEffect, useMemo } from 'react'
import BasePlot from './BasePlot'

function HeatmapHourlyDaily({ data = [], title = 'Heatmap Hourly Daily' }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  // Days of week in order (Monday → Sunday) - memoized
  const daysOrder = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], [])
  
  // Hours (0-23) - memoized
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])

  // Memoize layout to prevent unnecessary recalculations
  const layout = useMemo(() => ({
    xaxis: {
      title: {
        text: 'Hour of Day',
        font: { size: 14 }
      },
      tickmode: 'linear',
      tick0: 0,
      dtick: 2, // Show every 2 hours
      tickformat: 'd',
      gridcolor: '#e5e7eb',
      showgrid: true
    },
    yaxis: {
      title: {
        text: 'Day of Week',
        font: { size: 14 }
      },
      type: 'category',
      gridcolor: '#e5e7eb',
      showgrid: true
    },
    hovermode: 'closest'
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
      // Initialize 2D matrix: 7 rows (days) x 24 columns (hours)
      const matrix = daysOrder.map(() => Array(24).fill(0))

      // Fill matrix with data
      data.forEach(item => {
        const day = item.day || item.Day || ''
        const hour = item.hour !== undefined ? item.hour : (item.Hour !== undefined ? item.Hour : null)
        const count = item.count !== undefined ? item.count : (item.Count !== undefined ? item.Count : 0)

        if (day && hour !== null && hour >= 0 && hour < 24) {
          const dayIndex = daysOrder.findIndex(d => 
            d.toLowerCase() === day.toLowerCase()
          )
          
          if (dayIndex !== -1) {
            matrix[dayIndex][hour] = (matrix[dayIndex][hour] || 0) + count
          }
        }
      })

      // Create Plotly trace for heatmap
      const newPlotlyData = [
        {
          type: 'heatmap',
          x: hours,
          y: daysOrder,
          z: matrix,
          colorscale: 'YlOrRd',
          hovertemplate: '<b>%{y}</b><br>Hour: %{x}:00<br>Count: %{z:,.0f}<extra></extra>',
          showscale: true,
          colorbar: {
            title: {
              text: 'Count',
              font: { size: 12 }
            },
            thickness: 15,
            len: 0.6
          },
          xgap: 1,
          ygap: 1,
          zsmooth: 'best' // Smooth grid
        }
      ]

      setPlotlyData(newPlotlyData)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [data, daysOrder, hours])

  // Handle empty data case
  if (!data || data.length === 0 || plotlyData.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">No Data Available</p>
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

export default HeatmapHourlyDaily

