/*

  Chart Type: Line Chart

  Research Question:

  - How do collisions change during the hours of the day?

*/

import BasePlot from './BasePlot'

function HourlyTrendLineChart({ data = [], title = 'Hourly Trend Line Chart' }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const hours = data.map(item => item.hour ?? item.Hour ?? 0)
  const counts = data.map(item => item.count ?? item.Count ?? 0)

  const plotlyData = [
    {
      type: 'scatter',
      mode: 'lines+markers',
      x: hours,
      y: counts,
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
      hovertemplate: '<b>Hour %{x}:00</b><br>Count: %{y:,.0f}<extra></extra>',
      hoverinfo: 'x+y'
    }
  ]

  const layout = {
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
        text: 'Count',
        font: { size: 14 }
      },
      gridcolor: '#e5e7eb',
      showgrid: true,
      zeroline: true
    },
    hovermode: 'x unified'
  }

  return (
    <BasePlot
      title={title}
      data={plotlyData}
      layout={layout}
    />
  )
}

export default HourlyTrendLineChart

