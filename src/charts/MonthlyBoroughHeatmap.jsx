/*

  Chart Type: Heatmap

  Research Question:

  - Which combinations of vehicle type and contributing factor appear together most often?

*/

import { useMemo } from 'react'
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

function normalizeBorough(value) {
  if (!value) return ''
  return String(value)
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getMonthIndex(record) {
  const rawDate =
    record?.crash_date ||
    record?.CRASH_DATE ||
    record?.Crash_Date ||
    record?.date ||
    record?.Date

  if (rawDate) {
    const parsed = new Date(rawDate)
    if (!Number.isNaN(parsed)) {
      return parsed.getMonth()
    }
  }

  const rawMonth =
    record?.month ||
    record?.MONTH ||
    record?.Month

  if (rawMonth === null || rawMonth === undefined) return null

  const numeric = Number(rawMonth)
  if (!Number.isNaN(numeric)) {
    if (numeric >= 1 && numeric <= 12) return numeric - 1
    if (numeric >= 0 && numeric <= 11) return numeric
  }

  const normalized = String(rawMonth).trim().toLowerCase()
  const index = MONTH_NAMES.findIndex(month =>
    month.toLowerCase().startsWith(normalized)
  )
  return index === -1 ? null : index
}

function MonthlyBoroughHeatmap({ data = [], title = 'Monthly Borough Heatmap', layout: layoutOverride = {} }) {
  const { boroughs, matrix } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { boroughs: [], matrix: [] }
    }

    const boroughSet = new Set()
    const counts = new Map()

    data.forEach(record => {
      const borough = normalizeBorough(
        record?.borough ||
          record?.BOROUGH ||
          record?.Borough ||
          ''
      )

      if (!borough) return

      const monthIndex = getMonthIndex(record)
      if (monthIndex === null || monthIndex === undefined) return

      boroughSet.add(borough)
      const key = `${borough}::${monthIndex}`
      counts.set(key, (counts.get(key) || 0) + 1)
    })

    const sortedBoroughs = Array.from(boroughSet).sort((a, b) =>
      a.localeCompare(b)
    )

    const matrixData = sortedBoroughs.map(() => Array(12).fill(0))

    sortedBoroughs.forEach((borough, boroughIndex) => {
      for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
        const key = `${borough}::${monthIndex}`
        matrixData[boroughIndex][monthIndex] = counts.get(key) || 0
      }
    })

    return { boroughs: sortedBoroughs, matrix: matrixData }
  }, [data])

  if (!boroughs.length || !matrix.length) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const hasValues = matrix.some(row => row.some(value => value > 0))

  if (!hasValues) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const plotlyData = [
    {
      type: 'heatmap',
      x: MONTH_NAMES,
      y: boroughs,
      z: matrix,
      colorscale: 'Viridis',
      hovertemplate: '<b>%{y}</b><br>Month: %{x}<br>Count: %{z:,.0f}<extra></extra>',
      showscale: true,
      xgap: 1,
      ygap: 1
    }
  ]

  const baseLayout = useMemo(() => ({
    xaxis: {
      title: { text: 'Month', font: { size: 14 } },
      type: 'category',
      tickmode: 'array',
      tickvals: MONTH_NAMES
    },
    yaxis: {
      title: { text: 'Borough', font: { size: 14 } },
      type: 'category'
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

  return (
    <BasePlot
      title={title}
      data={plotlyData}
      layout={layout}
    />
  )
}

export default MonthlyBoroughHeatmap

