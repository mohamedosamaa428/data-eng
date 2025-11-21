/**
 * Data processing functions for Plotly.js charts
 * Each function cleans null values, groups data, and returns Plotly-ready objects
 */

/**
 * Process hourly collision data
 * Groups collisions by hour of day
 */
export function processHourlyData(data) {
  if (!data || data.length === 0) {
    return { x: [], y: [] }
  }

  // Clean null values and group by hour
  const hourlyCounts = {}
  
  data.forEach(row => {
    const crashTime = row.CRASH_TIME || row.crashTime || row.CRASH_DATE
    if (!crashTime) return

    // Extract hour from time (format: HH:MM or HH:MM:SS)
    let hour = null
    if (typeof crashTime === 'string') {
      const timeMatch = crashTime.match(/^(\d{1,2})/)
      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10)
      }
    } else if (typeof crashTime === 'number') {
      hour = Math.floor(crashTime / 100) // If stored as HHMM
    }

    if (hour !== null && hour >= 0 && hour <= 23) {
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1
    }
  })

  // Convert to arrays sorted by hour
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const counts = hours.map(hour => hourlyCounts[hour] || 0)

  return {
    x: hours,
    y: counts
  }
}

/**
 * Process borough collision data
 * Groups collisions by borough
 */
export function processBoroughData(data) {
  if (!data || data.length === 0) {
    return { x: [], y: [] }
  }

  // Clean null values and group by borough
  const boroughCounts = {}
  
  data.forEach(row => {
    const borough = row.BOROUGH || row.borough || row.Borough
    if (!borough || borough === null || borough === '') return

    boroughCounts[borough] = (boroughCounts[borough] || 0) + 1
  })

  // Convert to arrays sorted by count (descending)
  const entries = Object.entries(boroughCounts)
    .sort((a, b) => b[1] - a[1])

  return {
    x: entries.map(([borough]) => borough),
    y: entries.map(([, count]) => count)
  }
}

/**
 * Process monthly trend data
 * Groups collisions by month and year
 */
export function processMonthlyTrend(data) {
  if (!data || data.length === 0) {
    return { x: [], y: [] }
  }

  // Clean null values and group by month-year
  const monthlyCounts = {}
  
  data.forEach(row => {
    const crashDate = row.CRASH_DATE || row.crashDate || row.DATE
    if (!crashDate) return

    // Parse date (format: MM/DD/YYYY or YYYY-MM-DD)
    let monthYear = null
    if (typeof crashDate === 'string') {
      const dateParts = crashDate.split(/[\/\-]/)
      if (dateParts.length >= 3) {
        const month = parseInt(dateParts[0], 10)
        const year = parseInt(dateParts[2] || dateParts[0], 10)
        if (month >= 1 && month <= 12 && year) {
          monthYear = `${year}-${String(month).padStart(2, '0')}`
        }
      }
    } else if (crashDate instanceof Date) {
      const year = crashDate.getFullYear()
      const month = crashDate.getMonth() + 1
      monthYear = `${year}-${String(month).padStart(2, '0')}`
    }

    if (monthYear) {
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1
    }
  })

  // Convert to arrays sorted by date
  const entries = Object.entries(monthlyCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))

  return {
    x: entries.map(([date]) => date),
    y: entries.map(([, count]) => count)
  }
}

/**
 * Process injury severity data
 * Groups collisions by injury severity type
 */
export function processInjurySeverity(data) {
  if (!data || data.length === 0) {
    return { labels: [], values: [] }
  }

  // Clean null values and group by injury severity
  const severityCounts = {}
  
  data.forEach(row => {
    // Check multiple possible column names
    const severity = row.INJURY_SEVERITY || row.injurySeverity || row.INJURY_TYPE || row.injuryType
    if (!severity || severity === null || severity === '') return

    severityCounts[severity] = (severityCounts[severity] || 0) + 1
  })

  // Convert to arrays
  const entries = Object.entries(severityCounts)
    .sort((a, b) => b[1] - a[1])

  return {
    labels: entries.map(([severity]) => severity),
    values: entries.map(([, count]) => count)
  }
}

/**
 * Process vehicle type data
 * Groups collisions by vehicle type
 */
export function processVehicleTypes(data) {
  if (!data || data.length === 0) {
    return { labels: [], values: [] }
  }

  // Clean null values and group by vehicle type
  const vehicleTypeCounts = {}
  
  data.forEach(row => {
    // Check multiple possible column names for vehicle types
    const vehicleTypes = [
      row.VEHICLE_TYPE_CODE_1,
      row.VEHICLE_TYPE_CODE_2,
      row.VEHICLE_TYPE_CODE_3,
      row.VEHICLE_TYPE_CODE_4,
      row.VEHICLE_TYPE_CODE_5,
      row.vehicleType,
      row.VehicleType
    ].filter(v => v && v !== null && v !== '')

    vehicleTypes.forEach(vehicleType => {
      vehicleTypeCounts[vehicleType] = (vehicleTypeCounts[vehicleType] || 0) + 1
    })
  })

  // Convert to arrays sorted by count (descending)
  const entries = Object.entries(vehicleTypeCounts)
    .sort((a, b) => b[1] - a[1])

  return {
    labels: entries.map(([type]) => type),
    values: entries.map(([, count]) => count)
  }
}

/**
 * Process contributing factors data
 * Groups collisions by contributing factor
 */
export function processContributingFactors(data) {
  if (!data || data.length === 0) {
    return { x: [], y: [] }
  }

  // Clean null values and group by contributing factor
  const factorCounts = {}
  
  data.forEach(row => {
    // Check multiple possible column names for contributing factors
    const factors = [
      row.CONTRIBUTING_FACTOR_1,
      row.CONTRIBUTING_FACTOR_2,
      row.CONTRIBUTING_FACTOR_3,
      row.CONTRIBUTING_FACTOR_4,
      row.CONTRIBUTING_FACTOR_5,
      row.contributingFactor,
      row.ContributingFactor
    ].filter(f => f && f !== null && f !== '' && f.toLowerCase() !== 'unspecified')

    factors.forEach(factor => {
      factorCounts[factor] = (factorCounts[factor] || 0) + 1
    })
  })

  // Convert to arrays sorted by count (descending), take top 10
  const entries = Object.entries(factorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return {
    x: entries.map(([factor]) => factor),
    y: entries.map(([, count]) => count)
  }
}

