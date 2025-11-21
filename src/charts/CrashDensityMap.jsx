/*

  Chart Type: Map Visualization

  Research Question:

  - Which boroughs have the highest injury and fatality locations?

*/

import BasePlot from './BasePlot'

const MAPBOX_TOKEN =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_MAPBOX_TOKEN) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_MAPBOX_TOKEN) ||
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndjJ6b3Z3N3gifQ.tCP2II7uXx1JrcI4tyoLJQ'

function CrashDensityMap({ data = [], title = 'Crash Density Map' }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const processed = data
    .map(item => {
      const lat = Number(item.latitude ?? item.Latitude)
      const lon = Number(item.longitude ?? item.Longitude)
      const density =
        Number(item.density ?? item.Density ?? item.severity ?? item.Severity) || 0

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lon) ||
        lat < 40 ||
        lat > 41 ||
        lon < -75 ||
        lon > -73
      ) {
        return null
      }

      return {
        latitude: lat,
        longitude: lon,
        density
      }
    })
    .filter(Boolean)

  if (processed.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const lats = processed.map(point => point.latitude)
  const lons = processed.map(point => point.longitude)
  const densities = processed.map(point => point.density)

  const minDensity = Math.min(...densities)
  const maxDensity = Math.max(...densities)
  const sizeScale = value => {
    if (maxDensity === minDensity) return 8
    const normalized = (value - minDensity) / (maxDensity - minDensity)
    return 6 + normalized * 8 // range 6-14
  }

  const plotlyData = [
    {
      type: 'scattermapbox',
      lat: lats,
      lon: lons,
      mode: 'markers',
      marker: {
        size: densities.map(sizeScale),
        color: densities,
        colorscale: 'YlOrRd',
        cmin: minDensity,
        cmax: maxDensity,
        colorbar: {
          title: 'Density'
        },
        opacity: 0.8
      },
      hovertemplate: 'Lat: %{lat:.3f}<br>Lon: %{lon:.3f}<br>Density: %{marker.color:.0f}<extra></extra>'
    }
  ]

  const centerLat = lats.reduce((sum, value) => sum + value, 0) / lats.length
  const centerLon = lons.reduce((sum, value) => sum + value, 0) / lons.length

  const layout = {
    mapbox: {
      style: 'open-street-map',
      accesstoken: MAPBOX_TOKEN,
      center: { lat: centerLat, lon: centerLon },
      zoom: 10,
      pitch: 0,
      bearing: 0
    },
    margin: { l: 0, r: 0, t: 60, b: 0 },
    hovermode: 'closest'
  }

  return (
    <BasePlot
      title={title}
      data={plotlyData}
      layout={layout}
      config={{ mapboxAccessToken: MAPBOX_TOKEN }}
    />
  )
}

export default CrashDensityMap

