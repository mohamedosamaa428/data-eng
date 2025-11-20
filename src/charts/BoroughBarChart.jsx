/*

  Research Question:

  - Which borough has the highest number of collisions?

*/

import { useState, useEffect, useMemo } from 'react'
import BasePlot from './BasePlot'

function BoroughBarChart({ data = [], title = 'Borough Bar Chart' }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  // Memoize layout to prevent unnecessary recalculations
  const layout = useMemo(() => ({
    xaxis: {
      title: {
        text: 'Borough',
        font: { size: 14 }
      },
      tickangle: -45,
      type: 'category'
    },
    yaxis: {
      title: {
        text: 'Count',
        font: { size: 14 }
      },
      gridcolor: '#e5e7eb'
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
      const boroughs = data.map(item => item.borough || item.Borough || '')
      const counts = data.map(item => item.count || item.Count || 0)

      // Create Plotly trace for vertical bar chart
      const newPlotlyData = [
        {
          type: 'bar',
          x: boroughs,
          y: counts,
          marker: {
            color: '#3b82f6',
            line: {
              color: '#1e40af',
              width: 1
            }
          },
          text: counts.map(count => count.toLocaleString()),
          textposition: 'outside',
          hovertemplate: '<b>%{x}</b><br>Count: %{y:,.0f}<extra></extra>',
          hoverinfo: 'x+y'
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

export default BoroughBarChart

