/*

  Chart Type: Line Chart

  Research Question:

  - How do collisions change month-by-month over the years?

*/

import { useState, useEffect, useMemo } from 'react'
import BasePlot from './BasePlot'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

function getMonthIndex(value) {
  if (value === null || value === undefined) return null

  if (typeof value === 'number') {
    if (value >= 1 && value <= 12) return value - 1
    if (value >= 0 && value <= 11) return value
  }

  const numeric = Number(value)
  if (!Number.isNaN(numeric)) {
    if (numeric >= 1 && numeric <= 12) return numeric - 1
    if (numeric >= 0 && numeric <= 11) return numeric
  }

  const normalized = String(value).trim().toLowerCase()
  const matchIndex = MONTH_NAMES.findIndex(
    month => month.toLowerCase().startsWith(normalized)
  )

  return matchIndex === -1 ? null : matchIndex
}

function extractMonthKey(record) {
  const rawDate =
    record?.crash_date ||
    record?.CRASH_DATE ||
    record?.Crash_Date ||
    record?.date ||
    record?.Date

  if (rawDate) {
    const parsed = new Date(rawDate)
    if (!Number.isNaN(parsed)) {
      const year = parsed.getFullYear()
      const month = parsed.getMonth() + 1
      return `${year}-${String(month).padStart(2, '0')}`
    }
  }

  const year =
    record?.year ||
    record?.YEAR ||
    record?.Year

  if (!year) {
    return ''
  }

  const monthValue =
    record?.month ||
    record?.MONTH ||
    record?.Month

  const monthIndex = getMonthIndex(monthValue)

  if (monthIndex === null || monthIndex === undefined) {
    return `${year}`
  }

  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`
}

function formatKeyLabel(key) {
  if (!key) return ''
  if (!key.includes('-')) return key
  const [year, month] = key.split('-')
  const monthIndex = Number(month) - 1
  const monthName = MONTH_NAMES[monthIndex] ?? month
  return `${monthName} ${year}`
}

function YearLineChart({ data = [], title = 'Year Line Chart', layout: layoutOverride = {} }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  const aggregatedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []

    const counts = data.reduce((acc, record) => {
      const key = extractMonthKey(record)
      if (!key) return acc
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([key, count]) => ({
        key,
        label: formatKeyLabel(key),
        count
      }))
      .sort((a, b) => (a.key > b.key ? 1 : -1))
  }, [data])

  // Memoize layout to prevent unnecessary recalculations
  const baseLayout = useMemo(() => ({
    xaxis: {
      title: {
        text: 'Month',
        font: { size: 14 }
      },
      type: 'category', // Treat dates as categories for better display
      gridcolor: '#e5e7eb',
      showgrid: true
    },
    yaxis: {
      title: {
        text: 'Collisions',
        font: { size: 14 }
      },
      gridcolor: '#e5e7eb',
      showgrid: true
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
      const labels = aggregatedData.map(item => item.label)
      const counts = aggregatedData.map(item => item.count)

      // Create Plotly trace for smooth line chart with markers
      const newPlotlyData = [
        {
          type: 'scatter',
          mode: 'lines+markers',
          x: labels,
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
          hovertemplate: '<b>%{x}</b><br>Collisions: %{y:,.0f}<extra></extra>',
          hoverinfo: 'x+y',
          fill: 'none'
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

export default YearLineChart

