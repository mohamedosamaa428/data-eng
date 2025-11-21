/*

  Chart Type: Line Chart

  Research Question:

  - How do collisions change during the hours of the day?

*/

import { useMemo } from 'react'
import BasePlot from './BasePlot'

function getHour(record) {
  if (record?.hour !== undefined) {
    const parsed = Number(record.hour)
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < 24) {
      return parsed
    }
  }

  if (record?.Hour !== undefined) {
    const parsed = Number(record.Hour)
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < 24) {
      return parsed
    }
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
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < 24) {
      return parsed
    }
  }

  return null
}

function HourlyTrendLineChart({ data = [], title = 'Hourly Trend Line Chart', layout: layoutOverride = {} }) {
  const aggregatedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []

    const counts = Array.from({ length: 24 }, () => 0)

    data.forEach(record => {
      const hour = getHour(record)
      if (hour === null || hour === undefined) return
      counts[hour] += 1
    })

    return counts.map((count, hour) => ({ hour, count }))
  }, [data])

  if (!aggregatedData.length || aggregatedData.every(item => item.count === 0)) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const plotlyData = [
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: aggregatedData.map(item => item.hour),
      y: aggregatedData.map(item => item.count),
      line: {
        color: '#6366f1',
        width: 3,
        shape: 'spline'
      },
      marker: {
        size: 8,
        color: '#4338ca',
        line: {
          color: '#ffffff',
          width: 2
        }
      },
      hovertemplate: '<b>Hour %{x}:00</b><br>Collisions: %{y:,.0f}<extra></extra>',
      hoverinfo: 'x+y'
    }
  ]

  const baseLayout = useMemo(() => ({
    xaxis: {
      title: {
        text: 'Hour of Day',
        font: { size: 14 }
      },
      tickmode: 'linear',
      tick0: 0,
      dtick: 1,
      range: [0, 23],
      gridcolor: '#e5e7eb',
      showgrid: true
    },
    yaxis: {
      title: {
        text: 'Collisions',
        font: { size: 14 }
      },
      gridcolor: '#e5e7eb',
      showgrid: true,
      zeroline: true
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

  return (
    <BasePlot
      title={title}
      data={plotlyData}
      layout={layout}
    />
  )
}

export default HourlyTrendLineChart

