/*

  Research Question:

  - What are the top 10 contributing factors that cause collisions?

*/

import { useMemo } from 'react'
import BasePlot from './BasePlot'

function normalizeFactor(value) {
  if (!value) return ''
  const label = String(value).trim()
  if (!label) return ''
  return label
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function VehicleTypeBarChart({ data = [], title = 'Vehicle Type Bar Chart', layout: layoutOverride = {} }) {
  const aggregatedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []

    const counts = data.reduce((acc, record) => {
      const rawFactor =
        record?.contributing_factor ||
        record?.Contributing_Factor ||
        record?.factor ||
        record?.Factor ||
        record?.CONTRIBUTING_FACTOR_VEHICLE_1 ||
        record?.CONTRIBUTING_FACTOR ||
        ''

      const factor = normalizeFactor(rawFactor)

      if (!factor || factor.toLowerCase() === 'unspecified') return acc

      acc[factor] = (acc[factor] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [data])

  if (!aggregatedData.length) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const plotlyData = [
    {
      type: 'bar',
      x: aggregatedData.map(item => item.label),
      y: aggregatedData.map(item => item.count),
      marker: {
        color: '#14b8a6',
        line: {
          color: '#0f766e',
          width: 1
        }
      },
      hovertemplate: '<b>%{x}</b><br>Count: %{y:,.0f}<extra></extra>',
      hoverinfo: 'x+y',
      text: aggregatedData.map(value => value.count.toLocaleString()),
      textposition: 'outside'
    }
  ]

  const baseLayout = useMemo(() => ({
    xaxis: {
      title: {
        text: 'Contributing Factor',
        font: { size: 14 }
      },
      tickangle: -30,
      type: 'category'
    },
    yaxis: {
      title: {
        text: 'Collisions',
        font: { size: 14 }
      },
      gridcolor: '#e5e7eb',
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

export default VehicleTypeBarChart

