/*

  Research Question:

  - Which borough has the highest number of collisions?

*/

import { useState, useEffect, useMemo } from 'react'
import BasePlot from './BasePlot'

function BoroughBarChart({ data = [], title = 'Borough Bar Chart', layout: layoutOverride = {} }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  const aggregatedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []

    const counts = data.reduce((acc, record) => {
      const borough = String(
        record?.borough ??
          record?.BOROUGH ??
          record?.Borough ??
          ''
      ).trim()

      if (!borough) return acc

      const normalized = borough
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      acc[normalized] = (acc[normalized] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([borough, count]) => ({ borough, count }))
      .sort((a, b) => b.count - a.count)
  }, [data])

  // Memoize layout to prevent unnecessary recalculations
  const baseLayout = useMemo(() => ({
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
        text: 'Collisions',
        font: { size: 14 }
      },
      gridcolor: '#e5e7eb'
    },
    hovermode: 'x unified'
  }), [])

  const layout = useMemo(() => ({
    ...baseLayout,
    ...layoutOverride,
    xaxis: {
      ...baseLayout.xaxis,
      ...(layoutOverride.xaxis || {})
    },
    yaxis: {
      ...baseLayout.yaxis,
      ...(layoutOverride.yaxis || {})
    }
  }), [baseLayout, layoutOverride])

  // Transform data when props change
  useEffect(() => {
    if (!aggregatedData || aggregatedData.length === 0) {
      setPlotlyData([])
      return
    }

    // Fade out, update, then fade in
    setIsVisible(false)
    
    const timer = setTimeout(() => {
      const boroughs = aggregatedData.map(item => item.borough)
      const counts = aggregatedData.map(item => item.count)

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
          hovertemplate: '<b>%{x}</b><br>Collisions: %{y:,.0f}<extra></extra>',
          hoverinfo: 'x+y'
        }
      ]

      setPlotlyData(newPlotlyData)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [aggregatedData])

  // Handle empty data case
  if (!aggregatedData.length || plotlyData.length === 0) {
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

