/*
  Chart Type: Bubble Chart
  Research Question:
  - Which boroughs have the highest injury and fatality locations?
*/

import { useState, useEffect } from 'react'
import BasePlot from './BasePlot'

function BoroughInjuryFatalityBubbleChart({ data = [], title = 'Borough Injury and Fatality Severity' }) {
  const [plotlyData, setPlotlyData] = useState([])
  const [layout, setLayout] = useState({})
  const [isVisible, setIsVisible] = useState(true)

  // Transform data when props change
  useEffect(() => {
    if (!data || data.length === 0) {
      setPlotlyData([])
      setLayout({})
      return
    }

    // Fade out, update, then fade in
    setIsVisible(false)
    
    const timer = setTimeout(() => {
      // Process and validate data
      const processedData = data
        .filter(item => item && item.borough && 
          (item.injuries !== undefined || item.fatalities !== undefined))
        .map(item => {
          const injuries = Number(item.injuries) || 0
          const fatalities = Number(item.fatalities) || 0
          const severityScore = injuries + (fatalities * 5) // Weight fatalities more
          const bubbleSize = injuries + fatalities
          
          return {
            borough: item.borough,
            injuries,
            fatalities,
            severityScore,
            bubbleSize
          }
        })
        .sort((a, b) => b.severityScore - a.severityScore) // Sort by severity (highest first)

      if (processedData.length === 0) {
        setPlotlyData([])
        setLayout({})
        return
      }

      const boroughs = processedData.map(item => item.borough)
      const severityScores = processedData.map(item => item.severityScore)
      const bubbleSizes = processedData.map(item => item.bubbleSize)
      const fatalities = processedData.map(item => item.fatalities)
      const injuries = processedData.map(item => item.injuries)

      // Calculate size range for bubbles (min 10, max 50)
      const minSize = Math.min(...bubbleSizes)
      const maxSize = Math.max(...bubbleSizes)
      const sizeRange = maxSize - minSize || 1
      const scaledSizes = bubbleSizes.map(size => {
        const normalized = (size - minSize) / sizeRange
        return 10 + (normalized * 40) // Range: 10-50
      })

      // Calculate color scale for fatalities (darker = more fatalities)
      const maxFatalities = Math.max(...fatalities, 1)
      const colors = fatalities.map(fatality => {
        const intensity = fatality / maxFatalities
        // Red color scale: lighter red (low fatalities) to dark red (high fatalities)
        const r = Math.floor(255 - (intensity * 100))
        const g = Math.floor(100 - (intensity * 80))
        const b = Math.floor(100 - (intensity * 80))
        return `rgb(${r}, ${g}, ${b})`
      })

      // Create hover text
      const hoverTexts = processedData.map((item, idx) => {
        return `<b>${item.borough}</b><br>` +
               `Injuries: ${item.injuries.toLocaleString()}<br>` +
               `Fatalities: ${item.fatalities.toLocaleString()}<br>` +
               `Severity Score: ${item.severityScore.toLocaleString()}`
      })

      // Create Plotly trace for bubble chart
      const newPlotlyData = [
        {
          type: 'scatter',
          mode: 'markers',
          x: boroughs,
          y: severityScores,
          marker: {
            size: scaledSizes,
            color: colors,
            opacity: 0.7,
            line: {
              color: '#ffffff',
              width: 2
            },
            sizemode: 'diameter',
            sizeref: 1
          },
          text: hoverTexts,
          hovertemplate: '%{text}<extra></extra>',
          hoverinfo: 'text'
        }
      ]

      const newLayout = {
        title: {
          text: title,
          font: {
            size: 18,
            family: 'Arial, sans-serif',
            color: '#333'
          }
        },
        xaxis: {
          title: 'Borough',
          type: 'category'
        },
        yaxis: {
          title: 'Total Severity Score (Injuries + Fatalities × 5)'
        },
        margin: {
          l: 100,
          r: 40,
          t: 60,
          b: 100
        },
        hovermode: 'closest'
      }

      setPlotlyData(newPlotlyData)
      setLayout(newLayout)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [data, title])

  // Handle empty data case
  if (!data || data.length === 0) {
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

export default BoroughInjuryFatalityBubbleChart

