/*

  Chart Type: Pie Chart

  Research Question:

  - What share does each borough contribute to total collisions?

*/

import { useMemo } from 'react'
import BasePlot from './BasePlot'

function normalizeInjury(value) {
  if (!value) return 'Unknown'
  return String(value)
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function InjurySeverityPieChart({ data = [], title = 'Injury Severity Distribution', layout: layoutOverride = {} }) {
  const aggregatedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []

    const counts = data.reduce((acc, record) => {
      const severity =
        record?.injury_severity ||
        record?.Injury_Severity ||
        record?.severity ||
        record?.Severity ||
        record?.PERSON_INJURY ||
        record?.person_injury ||
        record?.injury ||
        'Unknown'

      const normalized = normalizeInjury(severity || 'Unknown')
      acc[normalized] = (acc[normalized] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  if (!aggregatedData.length || aggregatedData.every(item => item.value === 0)) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const plotlyData = [
    {
      type: 'pie',
      labels: aggregatedData.map(item => item.label),
      values: aggregatedData.map(item => item.value),
      hole: 0.4,
      hovertemplate: '<b>%{label}</b><br>Count: %{value:,.0f}<br>Share: %{percent}<extra></extra>',
      hoverinfo: 'label+value+percent',
      textinfo: 'percent',
      textposition: 'inside',
      marker: {
        colors: [
          '#22c55e',
          '#facc15',
          '#f97316',
          '#ef4444',
          '#a855f7',
          '#14b8a6'
        ],
        line: {
          color: '#ffffff',
          width: 2
        }
      }
    }
  ]

  const baseLayout = useMemo(() => ({
    showlegend: true,
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: -0.15,
      xanchor: 'center',
      x: 0.5,
      font: { size: 12 }
    },
    margin: { l: 20, r: 20, t: 60, b: 80 },
    annotations: [
      {
        text: title,
        x: 0.5,
        y: 0.5,
        showarrow: false,
        font: { size: 16, color: '#1f2937' },
        xanchor: 'center',
        yanchor: 'middle'
      }
    ]
  }), [title])

  const layout = useMemo(() => ({
    ...baseLayout,
    ...layoutOverride,
    legend: {
      ...baseLayout.legend,
      ...(layoutOverride.legend || {})
    },
    margin: {
      ...baseLayout.margin,
      ...(layoutOverride.margin || {})
    },
    annotations: layoutOverride.annotations || baseLayout.annotations
  }), [baseLayout, layoutOverride])

  return (
    <BasePlot
      title=""
      data={plotlyData}
      layout={layout}
    />
  )
}

export default InjurySeverityPieChart

