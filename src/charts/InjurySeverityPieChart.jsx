/*

  Chart Type: Pie Chart

  Research Question:

  - What share does each borough contribute to total collisions?

*/

import BasePlot from './BasePlot'

function InjurySeverityPieChart({ data = [], title = 'Injury Severity Distribution' }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const severities = data.map(item => item.severity || item.Severity || 'Unknown')
  const counts = data.map(item => item.count || item.Count || 0)

  const validData = severities
    .map((label, idx) => ({ label, value: counts[idx] }))
    .filter(({ value }) => value > 0)

  if (validData.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const plotlyData = [
    {
      type: 'pie',
      labels: validData.map(item => item.label),
      values: validData.map(item => item.value),
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

  const layout = {
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
  }

  return (
    <BasePlot
      title=""
      data={plotlyData}
      layout={layout}
    />
  )
}

export default InjurySeverityPieChart

