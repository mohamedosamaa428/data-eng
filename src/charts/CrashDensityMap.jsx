/*

  Chart Type: Map Visualization

  Research Question:

  - Which boroughs have the highest injury and fatality locations?

*/

import { useMemo } from 'react'
import BasePlot from './BasePlot'

function CrashDensityMap({ data = [], title = 'Crash Density Map', layout: layoutOverride = {} }) {
  const processed = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return []

    const pointMap = new Map()

    data.forEach(record => {
      const lat = Number(record.latitude ?? record.Latitude ?? record.LATITUDE)
      const lon = Number(record.longitude ?? record.Longitude ?? record.LONGITUDE)

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lon) ||
        lat < 40.0 ||
        lat > 41.0 ||
        lon < -75.0 ||
        lon > -73.0
      ) {
        return
      }

      const injuries =
        Number(
          record.injuries ??
            record.Injuries ??
            record.number_of_persons_injured ??
            record.NUMBER_OF_PERSONS_INJURED ??
            record.number_of_injured ??
            record.Number_of_Injured
        ) || 0

      const fatalities =
        Number(
          record.number_of_persons_killed ??
            record.NUMBER_OF_PERSONS_KILLED ??
            record.fatalities ??
            record.Fatalities
        ) || 0

      const densityContribution = Math.max(injuries + fatalities * 2, 1)
      const key = `${lat.toFixed(3)}|${lon.toFixed(3)}`

      if (!pointMap.has(key)) {
        pointMap.set(key, { latitude: lat, longitude: lon, density: 0 })
      }

      pointMap.get(key).density += densityContribution
    })

    return Array.from(pointMap.values())
  }, [data])

  if (!processed.length) {
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

  const baseLayout = {
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

  const layout = {
    ...baseLayout,
    ...layoutOverride,
    mapbox: {
      ...baseLayout.mapbox,
      ...(layoutOverride.mapbox || {})
    },
    margin: {
      ...baseLayout.margin,
      ...(layoutOverride.margin || {})
    }
  }

  return <BasePlot title={title} data={plotlyData} layout={layout} />
}

export default CrashDensityMap

