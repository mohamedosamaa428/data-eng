import Plot from 'react-plotly.js'

function BarChartPlaceholder() {
  const data = []
  
  const layout = {
    title: {
      text: 'Bar Chart',
      font: { size: 16 }
    },
    xaxis: { title: 'X Axis' },
    yaxis: { title: 'Y Axis' },
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
    <div className="w-full h-full min-h-[450px]">
      <Plot
        data={data}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%', minHeight: '450px' }}
      />
    </div>
  )
}

export default BarChartPlaceholder

