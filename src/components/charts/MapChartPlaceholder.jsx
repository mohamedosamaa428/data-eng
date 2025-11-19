import Plot from 'react-plotly.js'

function MapChartPlaceholder() {
  const data = []
  
  const layout = {
    title: {
      text: 'Map Chart',
      font: { size: 16 }
    },
    geo: {
      projection: {
        type: 'natural earth'
      },
      showframe: false,
      showcoastlines: true,
      showland: true,
      landcolor: '#f5f5f5',
      coastlinecolor: '#d3d3d3'
    },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    annotations: [
      {
        text: 'Chart will update here',
        showarrow: false,
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        y: 0.5,
        xanchor: 'center',
        yanchor: 'middle',
        font: { size: 14, color: 'gray' }
      }
    ]
  }

  const config = {
    displayModeBar: false,
    responsive: true
  }

  return (
    <div className="w-full h-full min-h-[500px]">
      <Plot
        data={data}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
      />
    </div>
  )
}

export default MapChartPlaceholder

