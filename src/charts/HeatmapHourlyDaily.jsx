/*

  Chart Type: Heatmap

  Research Question:

  - At what hour and on what day of the week do collisions happen the most?

*/

import { useState, useEffect, useMemo } from 'react'
import BasePlot from './BasePlot'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function normalizeDay(value) {
  if (!value) return ''
  const normalized = String(value)
    .trim()
    .toLowerCase()

  const match = DAY_NAMES.find(day =>
    day.toLowerCase().startsWith(normalized)
  )

  return match || ''
}

function getDayName(record) {
  const explicitDay =
    record?.day ||
    record?.Day ||
    record?.DAY ||
    record?.day_of_week ||
    record?.DAY_OF_WEEK

  if (explicitDay) {
    return normalizeDay(explicitDay)
  }

  const rawDate =
    record?.crash_date ||
    record?.CRASH_DATE ||
    record?.Crash_Date ||
    record?.date ||
    record?.Date

  if (rawDate) {
    const parsed = new Date(rawDate)
    if (!Number.isNaN(parsed)) {
      return DAY_NAMES[parsed.getDay()]
    }
  }

  return ''
}

function getHour(record) {
  if (record?.hour !== undefined) {
    const parsed = Number(record.hour)
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < 24) return parsed
  }

  if (record?.Hour !== undefined) {
    const parsed = Number(record.Hour)
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < 24) return parsed
  }

  const rawTime =
    record?.crash_time ||
    record?.CRASH_TIME ||
    record?.Crash_Time ||
    record?.time ||
    record?.Time

  if (rawTime) {
    const [hourToken] = String(rawTime).split(':')
    const parsed = Number(hourToken)
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < 24) return parsed
  }

  return null
}

function HeatmapHourlyDaily({ data = [], title = 'Heatmap Hourly Daily', layout: layoutOverride = {} }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  // Days of week in order (Monday → Sunday) - memoized
  const daysOrder = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], [])
  
  // Hours (0-23) - memoized
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])

  const aggregatedMatrix = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return daysOrder.map(() => Array(24).fill(0))
    }

    const matrix = daysOrder.map(() => Array(24).fill(0))

    data.forEach(record => {
      const dayName = getDayName(record)
      const hour = getHour(record)

      if (!dayName || hour === null || hour === undefined) return

      const dayIndex = daysOrder.findIndex(
        day => day.toLowerCase() === dayName.toLowerCase()
      )

      if (dayIndex === -1) return

      matrix[dayIndex][hour] += 1
    })

    return matrix
  }, [data, daysOrder])

  // Memoize layout to prevent unnecessary recalculations
  const baseLayout = useMemo(() => ({
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
    if (!aggregatedMatrix || aggregatedMatrix.length === 0) {
      setPlotlyData([])
      return
    }

    // Fade out, update, then fade in
    setIsVisible(false)
    
    const timer = setTimeout(() => {
      // Initialize 2D matrix: 7 rows (days) x 24 columns (hours)
      // Create Plotly trace for heatmap
      const newPlotlyData = [
        {
          type: 'heatmap',
          x: hours,
          y: daysOrder,
          z: aggregatedMatrix,
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
  }, [aggregatedMatrix, daysOrder, hours])

  // Handle empty data case
  const hasValues = aggregatedMatrix.some(row => row.some(value => value > 0))

  if (!hasValues || plotlyData.length === 0) {
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

export default HeatmapHourlyDaily

