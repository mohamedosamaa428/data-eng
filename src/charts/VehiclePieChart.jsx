/**
 * VehiclePieChart Component
 * 
 * Research Question: What is the distribution of crashes by vehicle type?
 * 
 * Filter Combinations:
 * - Vehicle Type: Primary filter - if selected, shows distribution within filtered types
 * - Year: Filters crashes by year range
 * - Borough: Filters crashes by specific borough(s)
 * - Contributing Factor: Filters by contributing factors
 * - Injury Type: Filters by severity of injuries
 * 
 * Expected Data Format from Backend:
 * [
 *   { category: string (vehicle type name), count: number },
 *   ...
 * ]
 * 
 * Alternative field names supported: Category, Count
 * 
 * Entries with zero or invalid counts are automatically filtered out.
 * Chart displays as a donut (pie with hole) with centered title and legend.
 */

import { useState, useEffect, useMemo } from 'react'
import BasePlot from './BasePlot'

function VehiclePieChart({ data = [], title = 'Vehicle Pie Chart' }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [layout, setLayout] = useState({})
  const [isVisible, setIsVisible] = useState(true)

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
    if (!data || data.length === 0) {
      setPlotlyData([])
      setLayout({})
      return
    }

    // Fade out, update, then fade in
    setIsVisible(false)
    
    const timer = setTimeout(() => {
      // Convert data array to Plotly format
      const labels = data.map(item => item.category || item.Category || 'Unknown')
      const values = data.map(item => item.count || item.Count || 0)

      // Filter out entries with zero or invalid values
      const validData = labels.map((label, index) => ({
        label,
        value: values[index]
      })).filter(item => item.value > 0)

      if (validData.length === 0) {
        setPlotlyData([])
        setLayout({})
        return
      }

      const validLabels = validData.map(item => item.label)
      const validValues = validData.map(item => item.value)

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

      setPlotlyData(newPlotlyData)
      setLayout(newLayout)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [data, title, colors])

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
        title="" // Title is shown in center annotation
        data={plotlyData}
        layout={layout}
      />
    </div>
  )
}

export default VehiclePieChart

