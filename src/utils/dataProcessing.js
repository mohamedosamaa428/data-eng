/**
 * Data processing functions for research questions
 * Each function processes raw CSV data into Plotly.js-ready format
 * All functions handle null/undefined values and filter invalid data
 */

/**
 * Helper function to get column value handling both underscore and space naming conventions
 * @param {Object} row - The data row
 * @param {string} underscoreName - Column name with underscores (e.g., 'CRASH_DATE')
 * @param {string} spaceName - Column name with spaces (e.g., 'CRASH DATE')
 * @returns {*} The column value or undefined if not found
 */
function getColumnValue(row, underscoreName, spaceName) {
  return row[underscoreName] !== undefined ? row[underscoreName] : row[spaceName]
}

/**
 * FUNCTION 1: Process borough collisions for bar chart
 * Counts collisions by BOROUGH and returns bar chart data
 */
export function processBoroughCollisions(data) {
  if (!data || data.length === 0) {
    return {
      x: [],
      y: [],
      type: 'bar',
      marker: { color: '#1976d2' }
    }
  }

  // Count collisions by borough, filtering out null/undefined
  const boroughCounts = data.reduce((acc, row) => {
    const borough = row.BOROUGH
    if (!borough || borough === null || borough === undefined || borough === '') {
      return acc
    }
    acc[borough] = (acc[borough] || 0) + 1
    return acc
  }, {})

  // Define borough order for consistent display
  const boroughOrder = ['MANHATTAN', 'BROOKLYN', 'QUEENS', 'BRONX', 'STATEN ISLAND']
  const labels = []
  const values = []

  // Add boroughs in order
  boroughOrder.forEach(borough => {
    if (boroughCounts[borough]) {
      labels.push(borough)
      values.push(boroughCounts[borough])
    }
  })

  // Add any other boroughs not in standard list
  Object.keys(boroughCounts).forEach(borough => {
    if (!boroughOrder.includes(borough)) {
      labels.push(borough)
      values.push(boroughCounts[borough])
    }
  })

  return {
    x: labels,
    y: values,
    type: 'bar',
    marker: { color: '#1976d2' }
  }
}

/**
 * FUNCTION 2: Process top contributing factors for horizontal bar chart
 * Uses CONTRIBUTING_FACTOR_VEHICLE_1, filters invalid values, returns top 10
 */
export function processTopContributingFactors(data) {
  if (!data || data.length === 0) {
    return {
      y: [],
      x: [],
      type: 'bar',
      orientation: 'h',
      marker: { color: '#ff6b6b' }
    }
  }

  // Count contributing factors, filtering out null/undefined/"Unspecified"/"Unknown"
  const factorCounts = data.reduce((acc, row) => {
    const factor = getColumnValue(row, 'CONTRIBUTING_FACTOR_VEHICLE_1', 'CONTRIBUTING FACTOR VEHICLE 1')
    const factorUpper =
      factor && typeof factor === 'string' && factor.trim() !== ''
        ? factor.toUpperCase()
        : 'UNKNOWN'

    if (
      factorUpper === 'UNSPECIFIED' ||
      factorUpper === 'UNKNOWN'
    ) {
      return acc
    }

    acc[factorUpper] = (acc[factorUpper] || 0) + 1
    return acc
  }, {})

  // Sort by count descending and take top 10
  const entries = Object.entries(factorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Return horizontal bar chart (reverse order for display: top at top)
  return {
    y: entries.map(([factor]) => factor).reverse(),
    x: entries.map(([, count]) => count).reverse(),
    type: 'bar',
    orientation: 'h',
    marker: { color: '#ff6b6b' }
  }
}

/**
 * FUNCTION 3: Process monthly trend for line chart
 * Parses CRASH_DATE (MM/DD/YYYY), groups by year-month, sorts chronologically
 */
export function processMonthlyTrend(data) {
  if (!data || data.length === 0) {
    return {
      x: [],
      y: [],
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#1976d2' }
    }
  }

  // Group by year-month using reduce
  const monthlyCounts = data.reduce((acc, row) => {
    const crashDate = getColumnValue(row, 'CRASH_DATE', 'CRASH DATE')
    if (!crashDate || crashDate === null || crashDate === undefined) {
      return acc
    }

    let monthYear = null

    // Parse date format: "MM/DD/YYYY"
    if (typeof crashDate === 'string') {
      const dateParts = crashDate.split('/')
      if (dateParts.length >= 3) {
        const month = parseInt(dateParts[0], 10)
        const year = parseInt(dateParts[2], 10)
        if (month >= 1 && month <= 12 && year) {
          monthYear = `${year}-${String(month).padStart(2, '0')}`
        }
      }
    } else if (crashDate instanceof Date) {
      // Handle Date objects
      const year = crashDate.getFullYear()
      const month = crashDate.getMonth() + 1
      monthYear = `${year}-${String(month).padStart(2, '0')}`
    }

    if (monthYear) {
      acc[monthYear] = (acc[monthYear] || 0) + 1
    }
    return acc
  }, {})

  // Convert to arrays and sort chronologically
  const entries = Object.entries(monthlyCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))

  return {
    x: entries.map(([date]) => date),
    y: entries.map(([, count]) => count),
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#1976d2' }
  }
}

/**
 * FUNCTION 4: Process hourly trend for line chart
 * Extracts hour from CRASH_TIME (HH:MM), groups by hour (0-23)
 */
export function processHourlyTrend(data) {
  if (!data || data.length === 0) {
    return {
      x: [],
      y: [],
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#4caf50' }
    }
  }

  // Initialize hour counts array (0-23)
  const hourCounts = Array(24).fill(0)

  // Process each row to extract hour from CRASH_TIME
  data.forEach(row => {
    const crashTime = getColumnValue(row, 'CRASH_TIME', 'CRASH TIME')
    if (!crashTime || crashTime === null || crashTime === undefined) {
      return
    }

    let hour = null

    // Handle string formats: "HH:MM" or "HH:MM:SS"
    if (typeof crashTime === 'string') {
      const timeMatch = crashTime.match(/^(\d{1,2})/)
      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10)
      }
    } else if (typeof crashTime === 'number') {
      // Handle numeric format (e.g., 1430 for 14:30)
      hour = Math.floor(crashTime / 100)
    }

    // Validate hour is between 0-23
    if (hour !== null && hour >= 0 && hour <= 23) {
      hourCounts[hour]++
    }
  })

  return {
    x: Array.from({ length: 24 }, (_, i) => i), // [0, 1, 2, ..., 23]
    y: hourCounts,
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#4caf50' }
  }
}

/**
 * FUNCTION 5: Process vehicle type distribution for pie chart
 * Uses VEHICLE_TYPE_CODE_1, filters null/undefined, returns top 8-10 types
 */
export function processVehicleTypeDistribution(data) {
  if (!data || data.length === 0) {
    return {
      labels: [],
      values: [],
      type: 'pie',
      hole: 0.3
    }
  }

  // Count vehicle types, filtering out null/undefined
  const vehicleTypeCounts = data.reduce((acc, row) => {
    const vehicleType = getColumnValue(row, 'VEHICLE_TYPE_CODE_1', 'VEHICLE TYPE CODE 1')
    if (!vehicleType || 
        vehicleType === null || 
        vehicleType === undefined || 
        vehicleType === '') {
      return acc
    }
    acc[vehicleType] = (acc[vehicleType] || 0) + 1
    return acc
  }, {})

  // Sort by count descending and take top 10
  const entries = Object.entries(vehicleTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return {
    labels: entries.map(([type]) => type),
    values: entries.map(([, count]) => count),
    type: 'pie',
    hole: 0.3
  }
}

/**
 * FUNCTION 6: Process borough distribution for pie chart
 * Counts by BOROUGH, calculates percentages
 */
export function processBoroughDistribution(data) {
  if (!data || data.length === 0) {
    return {
      labels: [],
      values: [],
      type: 'pie',
      textinfo: 'label+percent'
    }
  }

  // Count collisions by borough, filtering out null/undefined
  const boroughCounts = data.reduce((acc, row) => {
    const borough = getColumnValue(row, 'BOROUGH', 'BOROUGH')
    if (!borough || borough === null || borough === undefined || borough === '') {
      return acc
    }
    acc[borough] = (acc[borough] || 0) + 1
    return acc
  }, {})

  // Define borough order for consistent display
  const boroughOrder = ['MANHATTAN', 'BROOKLYN', 'QUEENS', 'BRONX', 'STATEN ISLAND']
  const labels = []
  const values = []

  // Add boroughs in order
  boroughOrder.forEach(borough => {
    if (boroughCounts[borough]) {
      labels.push(borough)
      values.push(boroughCounts[borough])
    }
  })

  // Add any other boroughs not in standard list
  Object.keys(boroughCounts).forEach(borough => {
    if (!boroughOrder.includes(borough)) {
      labels.push(borough)
      values.push(boroughCounts[borough])
    }
  })

  return {
    labels: labels,
    values: values,
    type: 'pie',
    textinfo: 'label+percent'
  }
}

/**
 * FUNCTION 7: Process hour and day heatmap
 * Extracts hour from CRASH_TIME and day from CRASH_DATE
 * Creates 2D array: rows = days (Mon-Sun), columns = hours (0-23)
 */
export function processHourDayHeatmap(data) {
  if (!data || data.length === 0) {
    return {
      z: [],
      x: [],
      y: [],
      type: 'heatmap',
      colorscale: 'YlOrRd'
    }
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = Array.from({ length: 24 }, (_, i) => i) // [0, 1, 2, ..., 23]

  // Initialize 2D matrix: 7 rows (days) x 24 columns (hours)
  const matrix = daysOfWeek.map(() => Array(24).fill(0))

  // Process each row to extract day and hour
  data.forEach(row => {
    const crashDate = getColumnValue(row, 'CRASH_DATE', 'CRASH DATE')
    const crashTime = getColumnValue(row, 'CRASH_TIME', 'CRASH TIME')

    if (!crashDate || !crashTime) return

    // Parse day of week from CRASH_DATE
    let dayIndex = null
    if (typeof crashDate === 'string') {
      const dateParts = crashDate.split('/')
      if (dateParts.length >= 3) {
        const month = parseInt(dateParts[0], 10) - 1 // Month is 0-indexed in Date
        const day = parseInt(dateParts[1], 10)
        const year = parseInt(dateParts[2], 10)
        const date = new Date(year, month, day)
        dayIndex = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Convert to Monday-first (0 = Monday, 6 = Sunday)
        dayIndex = (dayIndex + 6) % 7
      }
    } else if (crashDate instanceof Date) {
      dayIndex = crashDate.getDay()
      dayIndex = (dayIndex + 6) % 7
    }

    // Parse hour from CRASH_TIME
    let hour = null
    if (typeof crashTime === 'string') {
      const timeMatch = crashTime.match(/^(\d{1,2})/)
      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10)
      }
    } else if (typeof crashTime === 'number') {
      hour = Math.floor(crashTime / 100)
    }

    // Update matrix if both day and hour are valid
    if (dayIndex !== null && hour !== null && hour >= 0 && hour < 24) {
      matrix[dayIndex][hour]++
    }
  })

  return {
    z: matrix,
    x: hours,
    y: daysOfWeek,
    type: 'heatmap',
    colorscale: 'YlOrRd'
  }
}

/**
 * FUNCTION 8: Process vehicle type and contributing factor heatmap
 * Uses VEHICLE_TYPE_CODE_1 and CONTRIBUTING_FACTOR_VEHICLE_1
 * Takes top 10 vehicle types and top 10 factors, creates 2D matrix
 */
export function processVehicleFactorHeatmap(data) {
  if (!data || data.length === 0) {
    return {
      z: [],
      x: [],
      y: [],
      type: 'heatmap',
      colorscale: 'Blues'
    }
  }

  // First pass: count vehicle types and factors separately
  const vehicleTypeCounts = {}
  const factorCounts = {}
  const combinations = {}

  data.forEach(row => {
    const vehicleType = getColumnValue(row, 'VEHICLE_TYPE_CODE_1', 'VEHICLE TYPE CODE 1')
    const factor = getColumnValue(row, 'CONTRIBUTING_FACTOR_VEHICLE_1', 'CONTRIBUTING FACTOR VEHICLE 1')
    const factorUpper =
      factor && typeof factor === 'string' && factor.trim() !== ''
        ? factor.toUpperCase()
        : 'UNKNOWN'

    // Count vehicle types (filter null/undefined)
    if (vehicleType && vehicleType !== null && vehicleType !== undefined && vehicleType !== '') {
      vehicleTypeCounts[vehicleType] = (vehicleTypeCounts[vehicleType] || 0) + 1
    }

    // Count factors (filter null/undefined/"Unspecified"/"Unknown")
    if (
      factorUpper !== 'UNSPECIFIED' &&
      factorUpper !== 'UNKNOWN'
    ) {
      factorCounts[factorUpper] = (factorCounts[factorUpper] || 0) + 1
    }

    // Count combinations if both are valid
    if (
      vehicleType && vehicleType !== null && vehicleType !== undefined && vehicleType !== '' &&
      factorUpper !== 'UNSPECIFIED' &&
      factorUpper !== 'UNKNOWN'
    ) {
      const key = `${vehicleType}|${factorUpper}`
      combinations[key] = (combinations[key] || 0) + 1
    }
  })

  // Get top 10 vehicle types
  const topVehicleTypes = Object.entries(vehicleTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type]) => type)

  // Get top 10 factors
  const topFactors = Object.entries(factorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([factor]) => factor)

  // Build 2D matrix: rows = vehicle types, columns = factors
  const matrix = topVehicleTypes.map(() => Array(topFactors.length).fill(0))

  topVehicleTypes.forEach((vehicleType, i) => {
    topFactors.forEach((factor, j) => {
      const key = `${vehicleType}|${factor}`
      matrix[i][j] = combinations[key] || 0
    })
  })

  return {
    z: matrix,
    x: topFactors,
    y: topVehicleTypes,
    type: 'heatmap',
    colorscale: 'Blues'
  }
}

/**
 * FUNCTION 9: Process collision hotspots for scatter map
 * Uses LATITUDE and LONGITUDE, filters invalid coordinates
 * Samples data if too large (max 10000 points for performance)
 */
export function processCollisionHotspots(data) {
  if (!data || data.length === 0) {
    return {
      lat: [],
      lon: [],
      type: 'scattermapbox',
      mode: 'markers',
      marker: { size: 5, color: 'red', opacity: 0.5 }
    }
  }

  // Filter valid coordinates (NYC area: lat 40-41, lon -74 to -73)
  const validLocations = []
  data.forEach(row => {
    const lat = getColumnValue(row, 'LATITUDE', 'LATITUDE')
    const lon = getColumnValue(row, 'LONGITUDE', 'LONGITUDE')

    if (lat && lon && 
        typeof lat === 'number' && typeof lon === 'number' &&
        !isNaN(lat) && !isNaN(lon) &&
        lat >= 40 && lat <= 41 && 
        lon >= -74 && lon <= -73) {
      validLocations.push({ lat, lon })
    }
  })

  // Sample if data is too large (max 10000 points for performance)
  let sampledLocations = validLocations
  if (validLocations.length > 10000) {
    const step = Math.ceil(validLocations.length / 10000)
    sampledLocations = validLocations.filter((_, i) => i % step === 0).slice(0, 10000)
  }

  return {
    lat: sampledLocations.map(loc => loc.lat),
    lon: sampledLocations.map(loc => loc.lon),
    type: 'scattermapbox',
    mode: 'markers',
    marker: { size: 5, color: 'red', opacity: 0.5 }
  }
}

/**
 * FUNCTION 10: Process injury and fatality map
 * Uses LATITUDE, LONGITUDE, NUMBER_OF_PERSONS_INJURED, NUMBER_OF_PERSONS_KILLED
 * Filters valid coordinates and where injuries/deaths > 0
 * Marker size based on total severity (injuries + deaths)
 */
export function processInjuryFatalityMap(data) {
  if (!data || data.length === 0) {
    return {
      lat: [],
      lon: [],
      type: 'scattermapbox',
      mode: 'markers',
      marker: { size: [], color: [], colorscale: 'Reds', showscale: true }
    }
  }

  // Filter valid coordinates and where injuries/deaths > 0
  const validLocations = []
  data.forEach(row => {
    const lat = getColumnValue(row, 'LATITUDE', 'LATITUDE')
    const lon = getColumnValue(row, 'LONGITUDE', 'LONGITUDE')
    const injured = getColumnValue(row, 'NUMBER_OF_PERSONS_INJURED', 'NUMBER OF PERSONS INJURED') || 0
    const killed = getColumnValue(row, 'NUMBER_OF_PERSONS_KILLED', 'NUMBER OF PERSONS KILLED') || 0

    if (lat && lon && 
        typeof lat === 'number' && typeof lon === 'number' &&
        !isNaN(lat) && !isNaN(lon) &&
        lat >= 40 && lat <= 41 && 
        lon >= -74 && lon <= -73 &&
        (injured > 0 || killed > 0)) {
      // Calculate severity: injuries + (deaths * 10 for emphasis)
      const severity = Number(injured) + (Number(killed) * 10)
      validLocations.push({ lat, lon, severity })
    }
  })

  // Sample if data is too large (max 10000 points for performance)
  let sampledLocations = validLocations
  if (validLocations.length > 10000) {
    const step = Math.ceil(validLocations.length / 10000)
    sampledLocations = validLocations.filter((_, i) => i % step === 0).slice(0, 10000)
  }

  // Scale marker sizes (min 5, max 20, based on severity)
  const maxSeverity = Math.max(...sampledLocations.map(loc => loc.severity), 1)
  const sizes = sampledLocations.map(loc => {
    const scaled = 5 + (loc.severity / maxSeverity) * 15
    return Math.min(20, Math.max(5, scaled))
  })

  // Create hover text with injury/fatality info
  const text = sampledLocations.map(loc => {
    const row = data.find(r => {
      const rLat = getColumnValue(r, 'LATITUDE', 'LATITUDE')
      const rLon = getColumnValue(r, 'LONGITUDE', 'LONGITUDE')
      return rLat === loc.lat && rLon === loc.lon
    })
    const injured = row ? (getColumnValue(row, 'NUMBER_OF_PERSONS_INJURED', 'NUMBER OF PERSONS INJURED') || 0) : 0
    const killed = row ? (getColumnValue(row, 'NUMBER_OF_PERSONS_KILLED', 'NUMBER OF PERSONS KILLED') || 0) : 0
    return `Injured: ${injured}, Killed: ${killed}`
  })

  return {
    lat: sampledLocations.map(loc => loc.lat),
    lon: sampledLocations.map(loc => loc.lon),
    type: 'scattermapbox',
    mode: 'markers',
    marker: {
      size: sizes,
      color: sampledLocations.map(loc => loc.severity),
      colorscale: 'Reds',
      showscale: true,
      colorbar: { title: 'Severity' }
    },
    text: text,
    hovertemplate: '%{text}<extra></extra>'
  }
}
