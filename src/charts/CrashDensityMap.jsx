/*

  Chart Type: Map Visualization

  Research Question:

  - Which boroughs have the highest injury and fatality locations?

*/

import BasePlot from './BasePlot'

function CrashDensityMap({ data = [], title = 'Crash Density Map' }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg font-medium">This visualization will update once data is provided.</p>
      </div>
    )
  }

  const processed = data
    .map(item => ({
      latitude: item.latitude ?? item.Latitude,
      longitude: item.longitude ?? item.Longitude,
      density: item.density ?? item.Density ?? 0
    }))
    .filter(
      point =>
        point.latitude != null &&
        point.longitude != null &&
        !Number.isNaN(point.latitude) &&
        !Number.isNaN(point.longitude)
    )

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
      center: { lat: centerLat, lon: centerLon },
      zoom: 10,
      pitch: 0,
      bearing: 0
    },
    margin: { l: 0, r: 0, t: 60, b: 0 },
    hovermode: 'closest'
  }

  return <BasePlot title={title} data={plotlyData} layout={layout} />
}

export default CrashDensityMap

