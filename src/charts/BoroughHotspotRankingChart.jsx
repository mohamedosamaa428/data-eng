/*
  Chart Type: Bar Chart
  Research Question:
  - Where are collision hotspots located across NYC?
*/

import { useState, useEffect } from 'react'
import BasePlot from './BasePlot'

function BoroughHotspotRankingChart({ data = [], title = 'Collision Hotspot Ranking Across NYC' }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [layout, setLayout] = useState({})
  const [isVisible, setIsVisible] = useState(true)

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
      // Sort by count (highest first)
      const sortedData = [...data]
        .filter(item => item && item.borough && item.count !== undefined)
        .sort((a, b) => b.count - a.count)

      if (sortedData.length === 0) {
        setPlotlyData([])
        setLayout({})
        return
      }

      const boroughs = sortedData.map(item => item.borough)
      const counts = sortedData.map(item => Number(item.count) || 0)

      // Create Plotly trace for bar chart
      const newPlotlyData = [
        {
          type: 'bar',
          x: boroughs,
          y: counts,
          marker: {
            color: counts.map((count, idx) => {
              // Gradient color based on rank (darker for higher counts)
              const maxCount = Math.max(...counts)
              const intensity = count / maxCount
              // Blue gradient from light to dark
              return `rgba(59, 130, 246, ${0.5 + intensity * 0.5})`
            }),
            line: {
              color: '#1e40af',
              width: 1
            }
          },
          text: counts.map(count => count.toLocaleString()),
          textposition: 'outside',
          hovertemplate: '<b>%{x}</b><br>Collisions: %{y:,.0f}<extra></extra>',
          hoverinfo: 'x+y'
        }
      ]

      const newLayout = {
        title: {
          text: title,
          font: {
            size: 18,
            family: 'Arial, sans-serif',
            color: '#333'
          }
        },
        xaxis: {
          title: 'Borough',
          type: 'category'
        },
        yaxis: {
          title: 'Number of Collisions'
        },
        margin: {
          l: 80,
          r: 40,
          t: 60,
          b: 100
        },
        hovermode: 'closest'
      }

      setPlotlyData(newPlotlyData)
      setLayout(newLayout)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [data, title])

  // Handle empty data case
  if (!data || data.length === 0) {
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

export default BoroughHotspotRankingChart

