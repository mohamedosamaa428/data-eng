/*

  Chart Type: Heatmap

  Research Question:

  - Which combinations of vehicle type and contributing factor appear together most often?

*/

import BasePlot from './BasePlot'

function MonthlyBoroughHeatmap({ data = [], title = 'Monthly Borough Heatmap' }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const monthOrder = [
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

  const months = monthOrder
  const boroughs = Array.from(
    new Set(
      data
        .map(item => item.borough || item.Borough || '')
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b))

  if (boroughs.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const matrix = boroughs.map(() => Array(12).fill(0))

  data.forEach(item => {
    const month = item.month || item.Month || ''
    const borough = item.borough || item.Borough || ''
    const count = item.count || item.Count || 0

    const monthIndex = months.findIndex(m => m.toLowerCase() === String(month).toLowerCase())
    const boroughIndex = boroughs.findIndex(b => b.toLowerCase() === String(borough).toLowerCase())

    if (monthIndex !== -1 && boroughIndex !== -1) {
      matrix[boroughIndex][monthIndex] += count
    }
  })

  const plotlyData = [
    {
      type: 'heatmap',
      x: months,
      y: boroughs,
      z: matrix,
      colorscale: 'Viridis',
      hovertemplate: '<b>%{y}</b><br>Month: %{x}<br>Count: %{z:,.0f}<extra></extra>',
      showscale: true,
      xgap: 1,
      ygap: 1
    }
  ]

  const layout = {
    xaxis: {
      title: { text: 'Month', font: { size: 14 } },
      type: 'category',
      tickmode: 'array',
      tickvals: months
    },
    yaxis: {
      title: { text: 'Borough', font: { size: 14 } },
      type: 'category'
    },
    hovermode: 'closest'
  }

  return (
    <BasePlot
      title={title}
      data={plotlyData}
      layout={layout}
    />
  )
}

export default MonthlyBoroughHeatmap

