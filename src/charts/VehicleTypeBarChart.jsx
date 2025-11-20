/*

  Research Question:

  - What are the top 10 contributing factors that cause collisions?

*/

import BasePlot from './BasePlot'

function VehicleTypeBarChart({ data = [], title = 'Vehicle Type Bar Chart' }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const vehicleTypes = data.map(item => item.vehicle_type || item.vehicleType || item.Vehicle_Type || 'Unknown')
  const counts = data.map(item => item.count || item.Count || 0)

  const plotlyData = [
    {
      type: 'bar',
      x: vehicleTypes,
      y: counts,
      marker: {
        color: '#14b8a6',
        line: {
          color: '#0f766e',
          width: 1
        }
      },
      hovertemplate: '<b>%{x}</b><br>Count: %{y:,.0f}<extra></extra>',
      hoverinfo: 'x+y',
      text: counts.map(value => value.toLocaleString()),
      textposition: 'outside'
    }
  ]

  const layout = {
    xaxis: {
      title: {
        text: 'Vehicle Type',
        font: { size: 14 }
      },
      tickangle: -30,
      type: 'category'
    },
    yaxis: {
      title: {
        text: 'Count',
        font: { size: 14 }
      },
      gridcolor: '#e5e7eb',
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

export default VehicleTypeBarChart

