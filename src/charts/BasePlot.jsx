import Plot from 'react-plotly.js'

function BasePlot({ 
  title = '', 
  data = [], 
  layout = {}, 
  config = {} 
}) {
  // Default layout template
  const defaultLayout = {
    title: {
      text: title,
      font: { 
        size: 18,
        family: 'Arial, sans-serif',
        color: '#333'
      },
      x: 0.5,
      xanchor: 'center'
    },
    font: {
      family: 'Arial, sans-serif',
      size: 12,
      color: '#333'
    },
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    margin: {
      l: 60,
      r: 40,
      t: 60,
      b: 60,
      pad: 4
    },
    autosize: true,
    hovermode: 'closest'
  }

  // Merge default layout with provided layout (provided layout takes precedence)
  const mergedLayout = {
    ...defaultLayout,
    ...layout,
    // Deep merge for title to preserve default title properties
    title: {
      ...defaultLayout.title,
      ...(layout.title || {}),
      text: title || layout.title?.text || defaultLayout.title.text
    },
    // Deep merge for font
    font: {
      ...defaultLayout.font,
      ...(layout.font || {})
    },
    // Deep merge for margin
    margin: {
      ...defaultLayout.margin,
      ...(layout.margin || {})
    }
  }

  // Default config
  const defaultConfig = {
    displayModeBar: true,
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d']
  }

  // Merge default config with provided config
  const mergedConfig = {
    ...defaultConfig,
    ...config
  }

  return (
    <div className="w-full h-full min-h-[450px]">
      <Plot
        data={data}
        layout={mergedLayout}
        config={mergedConfig}
        style={{ width: '100%', height: '100%', minHeight: '450px' }}
        useResizeHandler={true}
      />
    </div>
  )
}

export default BasePlot

