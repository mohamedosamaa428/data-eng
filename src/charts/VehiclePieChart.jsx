/*

  Chart Type: Pie Chart

  Research Question:

  - What percentage of collisions involve each type of vehicle?

*/

import { useState, useEffect, useMemo } from 'react'
import BasePlot from './BasePlot'

function normalizeVehicle(value) {
  if (!value) return ''
  const label = String(value).trim()
  if (!label) return ''
  return label
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function VehiclePieChart({ data = [], title = 'Vehicle Pie Chart', layout: layoutOverride = {} }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [layout, setLayout] = useState({})
  const [isVisible, setIsVisible] = useState(true)

  const aggregatedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []

    const counts = data.reduce((acc, record) => {
      const vehicle =
        record?.vehicle_type ||
        record?.vehicleType ||
        record?.Vehicle_Type ||
        record?.VehicleType ||
        record?.VEHICLE_TYPE_CODE_1 ||
        record?.VEHICLE_TYPE_CODE ||
        record?.vehicle ||
        record?.Vehicle ||
        ''

      const normalized = normalizeVehicle(vehicle || '')
      if (!normalized) return acc

      acc[normalized] = (acc[normalized] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [data])

  // Memoize color palette
  const colors = useMemo(() => [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#f97316', // orange
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f43f5e'  // rose
  ], [])

  // Transform data when props change
  useEffect(() => {
    if (!aggregatedData || aggregatedData.length === 0) {
      setPlotlyData([])
      setLayout({})
      return
    }

    // Fade out, update, then fade in
    setIsVisible(false)
    
    const timer = setTimeout(() => {
      const validLabels = aggregatedData.map(item => item.label)
      const validValues = aggregatedData.map(item => item.value)

      // Create Plotly trace for pie chart (donut mode)
      const newPlotlyData = [
        {
          type: 'pie',
          labels: validLabels,
          values: validValues,
          hole: 0.4, // Donut mode
          hovertemplate: '<b>%{label}</b><br>Count: %{value:,.0f}<br>Percentage: %{percent}<extra></extra>',
          hoverinfo: 'label+value+percent',
          textinfo: 'percent',
          textposition: 'outside',
          marker: {
            colors: colors,
            line: {
              color: '#ffffff',
              width: 2
            }
          }
        }
      ]

      // Custom layout for pie chart
      const newLayout = {
        showlegend: true,
        legend: {
          orientation: 'v',
          x: 1.05,
          xanchor: 'left',
          y: 0.5,
          yanchor: 'middle',
          font: {
            size: 12
          }
        },
        annotations: [
          {
            text: title,
            x: 0.5,
            y: 0.5,
            xref: 'paper',
            yref: 'paper',
            showarrow: false,
            font: {
              size: 16,
              color: '#333',
              family: 'Arial, sans-serif'
            },
            xanchor: 'center',
            yanchor: 'middle'
          }
        ],
        margin: {
          l: 40,
          r: 120, // Extra space for legend
          t: 60,
          b: 60,
          pad: 4
        }
      }

      const mergedLayout = {
        ...newLayout,
        ...layoutOverride,
        legend: {
          ...newLayout.legend,
          ...(layoutOverride.legend || {})
        },
        margin: {
          ...newLayout.margin,
          ...(layoutOverride.margin || {})
        },
        annotations: layoutOverride.annotations || newLayout.annotations
      }

      setPlotlyData(newPlotlyData)
      setLayout(mergedLayout)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [aggregatedData, title, colors, layoutOverride])

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
        title="" // Title is shown in center annotation
        data={plotlyData}
        layout={layout}
      />
    </div>
  )
}

export default VehiclePieChart

