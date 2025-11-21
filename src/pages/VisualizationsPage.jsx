import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import Plot from 'react-plotly.js'
import {
  processBoroughCollisions,
  processTopContributingFactors,
  processMonthlyTrend,
  processHourlyTrend,
  processVehicleTypeDistribution,
  processBoroughDistribution,
  processHourDayHeatmap,
  processVehicleFactorHeatmap,
  processCollisionHotspots,
  processInjuryFatalityMap
} from '../utils/dataProcessing'
import CrashMap from '../charts/CrashMap'
import CrashDensityMap from '../charts/CrashDensityMap'
import BoroughHotspotRankingChart from '../charts/BoroughHotspotRankingChart'
import BoroughInjuryFatalityBubbleChart from '../charts/BoroughInjuryFatalityBubbleChart'
import SearchBar from '../components/SearchBar'

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const isValidCoordinate = (lat, lon) =>
  typeof lat === 'number' &&
  typeof lon === 'number' &&
  lat >= 40 &&
  lat <= 41 &&
  lon >= -75 &&
  lon <= -73

const sampleArray = (array, limit) => {
  if (array.length <= limit) return array
  const step = Math.ceil(array.length / limit)
  return array.filter((_, idx) => idx % step === 0).slice(0, limit)
}

/**
 * Parse natural language search query to extract filters
 * @param {string} query - The search query string
 * @returns {Object} Parsed filters object
 */
function parseSearchQuery(query) {
  if (!query || typeof query !== 'string') {
    return {
      borough: undefined,
      year: undefined,
      vehicleType: undefined,
      factor: undefined,
      injuryType: undefined
    }
  }

  const queryLower = query.toLowerCase().trim()
  const result = {
    borough: undefined,
    year: undefined,
    vehicleType: undefined,
    factor: undefined,
    injuryType: undefined
  }

  // Extract borough
  const boroughs = [
    { keywords: ['manhattan'], value: 'MANHATTAN' },
    { keywords: ['brooklyn'], value: 'BROOKLYN' },
    { keywords: ['queens'], value: 'QUEENS' },
    { keywords: ['bronx'], value: 'BRONX' },
    { keywords: ['staten island', 'staten'], value: 'STATEN ISLAND' }
  ]
  
  for (const borough of boroughs) {
    if (borough.keywords.some(keyword => queryLower.includes(keyword))) {
      result.borough = borough.value
      break
    }
  }

  // Extract year (4-digit year)
  const yearMatch = query.match(/\b(20\d{2}|19\d{2})\b/)
  if (yearMatch) {
    result.year = yearMatch[1]
  }

  // Extract vehicle type
  const vehicleTypes = [
    { keywords: ['sedan', 'car', 'passenger'], value: 'Sedan' },
    { keywords: ['suv', 'sport utility', 'station wagon'], value: 'Sport Utility / Station Wagon' },
    { keywords: ['taxi', 'cab'], value: 'Taxi' },
    { keywords: ['bus', 'transit'], value: 'Bus' },
    { keywords: ['bike', 'bicycle', 'cyclist'], value: 'Bike' },
    { keywords: ['motorcycle', 'motorcyclist'], value: 'Motorcycle' },
    { keywords: ['truck', 'pick-up', 'pickup'], value: 'Pick-up Truck' },
    { keywords: ['box truck'], value: 'Box Truck' },
    { keywords: ['ambulance'], value: 'Ambulance' },
    { keywords: ['fire truck', 'firetruck'], value: 'Fire Truck' },
    { keywords: ['pedestrian'], value: 'PEDESTRIAN' }
  ]

  for (const vehicle of vehicleTypes) {
    if (vehicle.keywords.some(keyword => queryLower.includes(keyword))) {
      result.vehicleType = vehicle.value
      break
    }
  }

  // Extract contributing factors
  const factors = [
    { keywords: ['distraction', 'distracted', 'inattention'], value: 'Driver Inattention/Distraction' },
    { keywords: ['speeding', 'speed', 'unsafe speed'], value: 'Unsafe Speed' },
    { keywords: ['alcohol', 'drunk', 'dwi', 'dui'], value: 'Alcohol Involvement' },
    { keywords: ['failure to yield', 'yield'], value: 'Failure to Yield Right-of-Way' },
    { keywords: ['following', 'tailgating', 'too closely'], value: 'Following Too Closely' },
    { keywords: ['red light', 'red-light', 'traffic control'], value: 'Traffic Control Disregarded' },
    { keywords: ['backing', 'backed'], value: 'Backing Unsafely' }
  ]

  for (const factor of factors) {
    if (factor.keywords.some(keyword => queryLower.includes(keyword))) {
      result.factor = factor.value
      break
    }
  }

  // Extract injury type
  if (queryLower.includes('fatal') || queryLower.includes('fatality') || queryLower.includes('death') || queryLower.includes('killed')) {
    result.injuryType = 'fatal'
  } else if (queryLower.includes('injury') || queryLower.includes('injured') || queryLower.includes('hurt')) {
    result.injuryType = 'injury'
  } else if (queryLower.includes('pedestrian')) {
    result.injuryType = 'pedestrian'
  }

  return result
}

const buildCrashMapData = (rows) => {
  if (!rows || rows.length === 0) return []

  const transformed = rows
    .map((row) => {
      const latitude =
        toNumber(row.LATITUDE ?? row.latitude ?? row.Latitude ?? row.lat ?? row.Lat)
      const longitude =
        toNumber(row.LONGITUDE ?? row.longitude ?? row.Longitude ?? row.lon ?? row.Lon)

      if (!isValidCoordinate(latitude, longitude)) return null

      const injuries =
        toNumber(
          row.NUMBER_OF_PERSONS_INJURED ??
            row['NUMBER OF PERSONS INJURED'] ??
            row.injuries ??
            row.Injuries
        ) || 0
      const killed =
        toNumber(
          row.NUMBER_OF_PERSONS_KILLED ??
            row['NUMBER OF PERSONS KILLED'] ??
            row.killed ??
            row.Killed
        ) || 0

      let severity = 'Minor'
      if (killed > 0) severity = 'Fatal'
      else if (injuries > 0) severity = 'Injury'

      return {
        latitude,
        longitude,
        severity,
        borough: row.BOROUGH ?? row['BOROUGH'] ?? 'Unknown',
        date: row.CRASH_DATE ?? row['CRASH DATE'] ?? '',
        time: row.CRASH_TIME ?? row['CRASH TIME'] ?? '',
        injuries
      }
    })
    .filter(Boolean)

  return sampleArray(transformed, 10000)
}

const buildCrashDensityData = (rows) => {
  if (!rows || rows.length === 0) return []

  const transformed = rows
    .map((row) => {
      const latitude =
        toNumber(row.LATITUDE ?? row.latitude ?? row.Latitude ?? row.lat ?? row.Lat)
      const longitude =
        toNumber(row.LONGITUDE ?? row.longitude ?? row.Longitude ?? row.lon ?? row.Lon)

      if (!isValidCoordinate(latitude, longitude)) return null

      const injuries =
        toNumber(
          row.NUMBER_OF_PERSONS_INJURED ??
            row['NUMBER OF PERSONS INJURED'] ??
            row.injuries ??
            row.Injuries
        ) || 0
      const killed =
        toNumber(
          row.NUMBER_OF_PERSONS_KILLED ??
            row['NUMBER OF PERSONS KILLED'] ??
            row.killed ??
            row.Killed
        ) || 0

      return {
        latitude,
        longitude,
        density: injuries + killed * 10
      }
    })
    .filter(Boolean)

  return sampleArray(transformed, 10000)
}

function VisualizationsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    borough: 'All Boroughs',
    year: 'All Years',
    vehicleType: 'All Vehicles',
    factor: 'All Factors',
    injuryType: 'All Types'
  })
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)

  /**
   * Validate data structure and required columns
   * @param {Array} data - The parsed CSV data
   * @returns {boolean} - Returns true if valid, false otherwise
   */
  const validateData = (data) => {
    // Check if data is an array and has length > 0
    if (!Array.isArray(data) || data.length === 0) {
      setError(new Error('Data is not a valid array or is empty'))
      return false
    }

    // Get the first row and log all its keys
    const firstRow = data[0]
    const allKeys = Object.keys(firstRow)
    console.log('All column names in dataset:', allKeys)

    // Required columns to check (handle both underscore and space naming conventions)
    const requiredColumns = [
      { underscore: 'CRASH_DATE', space: 'CRASH DATE' },
      { underscore: 'CRASH_TIME', space: 'CRASH TIME' },
      { underscore: 'BOROUGH', space: 'BOROUGH' },
      { underscore: 'COLLISION_ID', space: 'COLLISION_ID' },
      { underscore: 'NUMBER_OF_PERSONS_INJURED', space: 'NUMBER OF PERSONS INJURED' },
      { underscore: 'VEHICLE_TYPE_CODE_1', space: 'VEHICLE TYPE CODE 1' },
      { underscore: 'CONTRIBUTING_FACTOR_VEHICLE_1', space: 'CONTRIBUTING FACTOR VEHICLE 1' }
    ]

    // Check which required columns are missing
    const missingColumns = []
    const columnMapping = {}

    requiredColumns.forEach(({ underscore, space }) => {
      if (allKeys.includes(underscore)) {
        columnMapping[underscore] = underscore
      } else if (allKeys.includes(space)) {
        columnMapping[underscore] = space
      } else {
        missingColumns.push(underscore)
      }
    })

    if (missingColumns.length > 0) {
      const errorMessage = `Dataset is missing required columns: ${missingColumns.join(', ')}`
      console.error('Missing columns:', missingColumns)
      console.log('Available columns:', allKeys)
      setError(new Error(errorMessage))
      return false
    }

    // Store column mapping for use in data processing
    console.log('✅ Column mapping:', columnMapping)

    // All columns exist
    console.log('✅ All required columns found')
    return true
  }

  /**
   * Validate chart data processing functions
   * Logs all chart data to console for debugging
   */
  const validateChartData = (dataToValidate) => {
    console.group('🔍 Chart Data Validation')
    
    try {
      console.log('Q1 - Borough Collisions:', processBoroughCollisions(dataToValidate))
    } catch (error) {
      console.error('❌ Q1 Error:', error)
    }
    
    try {
      console.log('Q2 - Top Factors:', processTopContributingFactors(dataToValidate))
    } catch (error) {
      console.error('❌ Q2 Error:', error)
    }
    
    try {
      console.log('Q3 - Monthly Trend:', processMonthlyTrend(dataToValidate))
    } catch (error) {
      console.error('❌ Q3 Error:', error)
    }
    
    try {
      console.log('Q4 - Hourly Trend:', processHourlyTrend(dataToValidate))
    } catch (error) {
      console.error('❌ Q4 Error:', error)
    }
    
    try {
      console.log('Q5 - Vehicle Distribution:', processVehicleTypeDistribution(dataToValidate))
    } catch (error) {
      console.error('❌ Q5 Error:', error)
    }
    
    try {
      console.log('Q6 - Borough Distribution:', processBoroughDistribution(dataToValidate))
    } catch (error) {
      console.error('❌ Q6 Error:', error)
    }
    
    try {
      console.log('Q7 - Hour-Day Heatmap:', processHourDayHeatmap(dataToValidate))
    } catch (error) {
      console.error('❌ Q7 Error:', error)
    }
    
    try {
      console.log('Q8 - Vehicle-Factor Heatmap:', processVehicleFactorHeatmap(dataToValidate))
    } catch (error) {
      console.error('❌ Q8 Error:', error)
    }
    
    try {
      console.log('Q9 - Collision Hotspots:', processCollisionHotspots(dataToValidate))
    } catch (error) {
      console.error('❌ Q9 Error:', error)
    }
    
    try {
      console.log('Q10 - Injury/Fatality Map:', processInjuryFatalityMap(dataToValidate))
    } catch (error) {
      console.error('❌ Q10 Error:', error)
    }
    
    console.groupEnd()
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      Papa.parse('/data/merged_crashes_sampled.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('✅ CSV Parse Complete!')
          console.log('Total rows loaded:', results.data ? results.data.length : 0)

          if (results.data && results.data.length > 0) {
            const parsedData = results.data
            console.log('Sample row:', parsedData[0])
            console.log('Columns:', Object.keys(parsedData[0]).join(', '))

            // Validate data structure and required columns
            const isValid = validateData(parsedData)
            if (!isValid) {
              setLoading(false)
              return
            }

            setData(parsedData)

            // Validate chart data after loading
            setTimeout(() => {
              validateChartData(parsedData)
            }, 100)
          } else {
            console.error('No data loaded')
            setError(new Error('No data loaded'))
          }

          setLoading(false)
        },
        error: (error) => {
          console.error('❌ Parse error:', error)
          setError(error)
          setLoading(false)
        }
      })
    }

    fetchData()
  }, [])

  // Clear search mode when filters are manually changed via dropdowns
  useEffect(() => {
    if (isSearchMode && searchQuery) {
      // If user manually changes filters, keep search mode but allow manual adjustments
      // This allows users to refine search results
    }
  }, [filters, isSearchMode, searchQuery])

  /**
   * Apply filters to data and update filteredData state
   * This function is used by both search mode and dropdown filtering
   * @param {Object} filtersToApply - Optional filters object, defaults to current filters state
   */
  const applyFilters = (filtersToApply = null) => {
    if (!data || data.length === 0) {
      console.log('No data available to filter')
      setFilteredData([])
      return
    }

    // Use provided filters or current state
    const activeFilters = filtersToApply || filters

    // Start with a copy of all data
    let filtered = [...data]
    const originalLength = filtered.length

    // Log applied filters
    console.group('🔍 Filtering Data')
    console.log('Applied Filters:', activeFilters)
    console.log('Original data length:', originalLength)

    // Apply borough filter
    if (activeFilters.borough !== 'All Boroughs') {
      const beforeBorough = filtered.length
      filtered = filtered.filter(row => {
        const borough = row.BOROUGH || row['BOROUGH']
        return borough === activeFilters.borough
      })
      console.log(`Borough filter (${activeFilters.borough}): ${beforeBorough} → ${filtered.length}`)
    }

    // Apply year filter
    if (activeFilters.year !== 'All Years') {
      const beforeYear = filtered.length
      filtered = filtered.filter(row => {
        const crashDate = row.CRASH_DATE || row['CRASH DATE']
        if (!crashDate) return false

        // Parse CRASH_DATE to get year (format: MM/DD/YYYY or ISO format)
        let year = null
        if (typeof crashDate === 'string') {
          // Try MM/DD/YYYY format first
          const dateParts = crashDate.split('/')
          if (dateParts.length >= 3) {
            year = dateParts[2]?.substring(0, 4)
          } else {
            // Try ISO format (YYYY-MM-DD)
            const isoMatch = crashDate.match(/^(\d{4})/)
            if (isoMatch) {
              year = isoMatch[1]
            }
          }
        } else if (crashDate instanceof Date) {
          year = String(crashDate.getFullYear())
        }

        return String(year) === String(activeFilters.year)
      })
      console.log(`Year filter (${activeFilters.year}): ${beforeYear} → ${filtered.length}`)
    }

    // Apply vehicle type filter
    if (activeFilters.vehicleType !== 'All Vehicles') {
      const beforeVehicle = filtered.length
      filtered = filtered.filter(row => {
        const vehicle1 = row.VEHICLE_TYPE_CODE_1 || row['VEHICLE TYPE CODE 1']
        const vehicle2 = row.VEHICLE_TYPE_CODE_2 || row['VEHICLE TYPE CODE 2']
        return vehicle1 === activeFilters.vehicleType || vehicle2 === activeFilters.vehicleType
      })
      console.log(`Vehicle type filter (${activeFilters.vehicleType}): ${beforeVehicle} → ${filtered.length}`)
    }

    // Apply contributing factor filter
    if (activeFilters.factor !== 'All Factors') {
      const beforeFactor = filtered.length
      filtered = filtered.filter(row => {
        const factor1 = row.CONTRIBUTING_FACTOR_VEHICLE_1 || row['CONTRIBUTING FACTOR VEHICLE 1']
        const factor2 = row.CONTRIBUTING_FACTOR_VEHICLE_2 || row['CONTRIBUTING FACTOR VEHICLE 2']
        return factor1 === activeFilters.factor || factor2 === activeFilters.factor
      })
      console.log(`Factor filter (${activeFilters.factor}): ${beforeFactor} → ${filtered.length}`)
    }

    // Apply injury type filter
    if (activeFilters.injuryType !== 'All Types') {
      const beforeInjury = filtered.length
      filtered = filtered.filter(row => {
        const injured = toNumber(
          row.NUMBER_OF_PERSONS_INJURED || row['NUMBER OF PERSONS INJURED']
        ) || 0
        const killed = toNumber(
          row.NUMBER_OF_PERSONS_KILLED || row['NUMBER OF PERSONS KILLED']
        ) || 0

        if (activeFilters.injuryType === 'fatal') {
          return killed > 0
        } else if (activeFilters.injuryType === 'injury') {
          return injured > 0
        } else if (activeFilters.injuryType === 'pedestrian') {
          // Check if pedestrian involved (simplified check)
          const vehicle1 = (row.VEHICLE_TYPE_CODE_1 || row['VEHICLE TYPE CODE 1'] || '').toLowerCase()
          return vehicle1.includes('pedestrian')
        }
        return true
      })
      console.log(`Injury type filter (${activeFilters.injuryType}): ${beforeInjury} → ${filtered.length}`)
    }

    // Set filtered data
    setFilteredData(filtered)

    // Log filtering results
    console.log(`Final result: ${originalLength} → ${filtered.length} rows`)
    console.groupEnd()
    
    if (filtered.length === 0) {
      console.warn('No data matches these filters')
    }
  }

  /**
   * Handle search query - parse and apply filters automatically
   */
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return
    }

    // Parse the search query
    const parsed = parseSearchQuery(searchQuery)
    console.log('🔍 Parsed search query:', parsed)

    // Update filters with parsed values
    const newFilters = {
      borough: parsed.borough || 'All Boroughs',
      year: parsed.year || 'All Years',
      vehicleType: parsed.vehicleType || 'All Vehicles',
      factor: parsed.factor || 'All Factors',
      injuryType: parsed.injuryType || 'All Types'
    }

    setFilters(newFilters)
    setIsSearchMode(true)

    // Apply filters immediately with the new filters
    setTimeout(() => {
      applyFilters(newFilters)
    }, 100)
  }

  /**
   * Clear search and reset to default filters
   */
  const handleClearSearch = () => {
    setSearchQuery('')
    setIsSearchMode(false)
    setFilters({
      borough: 'All Boroughs',
      year: 'All Years',
      vehicleType: 'All Vehicles',
      factor: 'All Factors',
      injuryType: 'All Types'
    })
    setFilteredData([])
  }

  /**
   * Handle Generate Report button click
   * Works with both search mode and dropdown filtering
   */
  const handleGenerateReport = () => {
    applyFilters()
  }

  // Use filteredData if it exists, otherwise use all data
  const displayData = filteredData.length > 0 ? filteredData : data

  const crashMapData = useMemo(() => buildCrashMapData(displayData), [displayData])
  const crashDensityData = useMemo(() => buildCrashDensityData(displayData), [displayData])
  
  // Process borough hotspot data for Q9 bar chart
  const boroughHotspotData = useMemo(() => {
    const boroughData = processBoroughCollisions(displayData)
    if (!boroughData || !boroughData.x || !boroughData.y) return []
    
    return boroughData.x.map((borough, idx) => ({
      borough: borough,
      count: boroughData.y[idx] || 0
    }))
  }, [displayData])

  // Process borough injury/fatality data for Q10 bubble chart
  const boroughInjuryFatalityData = useMemo(() => {
    if (!displayData || displayData.length === 0) return []
    
    const boroughStats = {}
    
    displayData.forEach(row => {
      const borough = row.BOROUGH ?? row['BOROUGH'] ?? null
      if (!borough) return
      
      const injuries = toNumber(
        row.NUMBER_OF_PERSONS_INJURED ??
        row['NUMBER OF PERSONS INJURED'] ??
        row.injuries ??
        row.Injuries
      ) || 0
      
      const fatalities = toNumber(
        row.NUMBER_OF_PERSONS_KILLED ??
        row['NUMBER OF PERSONS KILLED'] ??
        row.killed ??
        row.Killed
      ) || 0
      
      if (!boroughStats[borough]) {
        boroughStats[borough] = { borough, injuries: 0, fatalities: 0 }
      }
      
      boroughStats[borough].injuries += injuries
      boroughStats[borough].fatalities += fatalities
    })
    
    return Object.values(boroughStats).filter(item => item.injuries > 0 || item.fatalities > 0)
  }, [displayData])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
        {/* Warning Banner */}
        <div className="memory-warning">
          ⚠️ This dashboard loads a large dataset (366MB, 2M+ rows). Loading may take 1-3 minutes. For better performance on slower devices, please use a desktop computer.
        </div>
        
        {/* Loading Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem-80px)]">
          <div className="loading">
            <div className="spinner"></div>
            <h2>Loading NYC Collision Dataset</h2>
            <p><strong>File size:</strong> 366MB (2 million+ collision records)</p>
            <p><strong>Estimated time:</strong> 1-3 minutes</p>
            <p>☕ Please wait while we load and process the data...</p>
            <p style={{fontSize: '13px', color: '#999', marginTop: '20px'}}>
              Tip: For faster loading, consider using a sampled dataset
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <p className="text-sm text-gray-500">Please check that the CSV file exists at /data/merged_crashes_sampled.csv</p>
        </div>
      </div>
    )
  }

  // Only show filters + charts after loading completes
  return (
    <div className="dashboard min-h-[calc(100vh-4rem)] bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-sm">Data visualizations and analytics</p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search: e.g., 'Brooklyn 2022 pedestrian crashes' or 'Queens taxi accidents 2021'"
          />
        </div>
        
        {/* Search Mode Indicator */}
        {isSearchMode && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-900">
                  Search mode active: Filters updated from search query
                </span>
              </div>
              <button
                onClick={handleClearSearch}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Filters Container */}
        <div className="filters-container mb-8 flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-gray-700 w-full md:w-auto">Filter Data:</label>
          
          {/* Borough Dropdown */}
          <select
            value={filters.borough}
            onChange={(e) => setFilters({ ...filters, borough: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
          >
            <option value="All Boroughs">All Boroughs</option>
            <option value="MANHATTAN">MANHATTAN</option>
            <option value="BROOKLYN">BROOKLYN</option>
            <option value="QUEENS">QUEENS</option>
            <option value="BRONX">BRONX</option>
            <option value="STATEN ISLAND">STATEN ISLAND</option>
          </select>

          {/* Year Dropdown */}
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
          >
            <option value="All Years">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
            <option value="2015">2015</option>
          </select>

          {/* Vehicle Type Dropdown */}
          <select
            value={filters.vehicleType}
            onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
          >
            <option value="All Vehicles">All Vehicles</option>
            <option value="Sedan">Sedan</option>
            <option value="Sport Utility / Station Wagon">Sport Utility / Station Wagon</option>
            <option value="Taxi">Taxi</option>
            <option value="Bus">Bus</option>
            <option value="Bike">Bike</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Pick-up Truck">Pick-up Truck</option>
            <option value="Box Truck">Box Truck</option>
            <option value="Ambulance">Ambulance</option>
            <option value="Fire Truck">Fire Truck</option>
          </select>

          {/* Contributing Factor Dropdown */}
          <select
            value={filters.factor}
            onChange={(e) => setFilters({ ...filters, factor: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
          >
            <option value="All Factors">All Factors</option>
            <option value="Driver Inattention/Distraction">Driver Inattention/Distraction</option>
            <option value="Unsafe Speed">Unsafe Speed</option>
            <option value="Alcohol Involvement">Alcohol Involvement</option>
            <option value="Failure to Yield Right-of-Way">Failure to Yield Right-of-Way</option>
            <option value="Following Too Closely">Following Too Closely</option>
            <option value="Traffic Control Disregarded">Traffic Control Disregarded</option>
            <option value="Backing Unsafely">Backing Unsafely</option>
          </select>

          {/* Injury Type Dropdown */}
          <select
            value={filters.injuryType}
            onChange={(e) => setFilters({ ...filters, injuryType: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
          >
            <option value="All Types">All Types</option>
            <option value="injury">Injury</option>
            <option value="fatal">Fatal</option>
            <option value="pedestrian">Pedestrian</option>
          </select>

          {/* Generate Report Button */}
          <button
            onClick={handleGenerateReport}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
          >
            Generate Report
          </button>
        </div>
        
        {/* Research Questions Section */}
        <div className="research-questions space-y-8">
          {/* QUESTION 1 (Bar Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 1</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Bar Chart</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Which borough has the highest number of collisions?</h3>
            <Plot
              data={[processBoroughCollisions(displayData)]}
              layout={{
                title: 'Total Collisions by Borough',
                xaxis: { title: 'Borough' },
                yaxis: { title: 'Number of Collisions' },
                margin: { l: 80, r: 40, t: 60, b: 100 },
                height: 400
              }}
              config={{ displayModeBar: true, responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d'] }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* QUESTION 2 (Bar Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 2</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Bar Chart</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">What are the top 10 contributing factors that cause collisions?</h3>
            <Plot
              data={[processTopContributingFactors(displayData)]}
              layout={{
                title: 'Top 10 Contributing Factors to Collisions',
                xaxis: { title: 'Number of Collisions' },
                yaxis: { 
                  title: 'Contributing Factor',
                  automargin: true
                },
                margin: { l: 250, r: 40, t: 60, b: 80 },
                height: 500
              }}
              config={{ displayModeBar: true, responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d'] }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* QUESTION 3 (Line Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 3</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Line Chart</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">How do collisions change month-by-month over the years?</h3>
            <Plot
              data={[processMonthlyTrend(displayData)]}
              layout={{
                title: 'Monthly Collision Trends Over Time',
                xaxis: { title: 'Month-Year' },
                yaxis: { title: 'Number of Collisions' },
                margin: { l: 80, r: 40, t: 60, b: 100 },
                height: 400
              }}
              config={{ displayModeBar: true, responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d'] }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* QUESTION 4 (Line Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 4</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Line Chart</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">How do collisions change during the hours of the day?</h3>
            <Plot
              data={[processHourlyTrend(displayData)]}
              layout={{
                title: 'Collisions Throughout the Day',
                xaxis: { title: 'Hour of Day (0-23)' },
                yaxis: { title: 'Number of Collisions' },
                margin: { l: 80, r: 40, t: 60, b: 80 },
                height: 400
              }}
              config={{ displayModeBar: true, responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d'] }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* QUESTION 5 (Pie Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 5</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Pie Chart</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">What percentage of collisions involve each type of vehicle?</h3>
            <Plot
              data={[processVehicleTypeDistribution(displayData)]}
              layout={{
                title: 'Vehicle Type Distribution in Collisions',
                margin: { l: 40, r: 40, t: 60, b: 40 },
                height: 500
              }}
              config={{ displayModeBar: true, responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d'] }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* QUESTION 6 (Pie Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 6</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Pie Chart</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">What share does each borough contribute to total collisions?</h3>
            <Plot
              data={[processBoroughDistribution(displayData)]}
              layout={{
                title: 'Borough Share of Total Collisions',
                margin: { l: 40, r: 40, t: 60, b: 40 },
                height: 500
              }}
              config={{ displayModeBar: true, responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d'] }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* QUESTION 7 (Heatmap) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 7</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Heatmap</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">At what hour and on what day of the week do collisions happen the most?</h3>
            <Plot
              data={[processHourDayHeatmap(displayData)]}
              layout={{
                title: 'Collision Heatmap: Day of Week vs Hour',
                xaxis: { title: 'Hour of Day' },
                yaxis: { title: 'Day of Week' },
                margin: { l: 100, r: 40, t: 60, b: 80 },
                height: 500
              }}
              config={{ displayModeBar: true, responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d'] }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* QUESTION 8 (Heatmap) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 8</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Heatmap</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Which combinations of vehicle type and contributing factor appear together most often?</h3>
            <Plot
              data={[processVehicleFactorHeatmap(displayData)]}
              layout={{
                title: 'Vehicle Type vs Contributing Factor Heatmap',
                xaxis: { 
                  title: 'Contributing Factor',
                  tickangle: -45,
                  automargin: true
                },
                yaxis: { 
                  title: 'Vehicle Type',
                  automargin: true
                },
                margin: { l: 250, r: 40, t: 60, b: 250 },
                height: 700
              }}
              config={{ displayModeBar: true, responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d', 'lasso2d'] }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* QUESTION 9 (Bar Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 9</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Bar Chart</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Where are collision hotspots located across NYC?</h3>
            <BoroughHotspotRankingChart data={boroughHotspotData} title="Collision Hotspot Ranking Across NYC"             />
          </div>

          {/* QUESTION 10 (Bubble Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 10</h2>
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Bubble Chart</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Which boroughs have the highest injury and fatality locations?</h3>
            <BoroughInjuryFatalityBubbleChart data={boroughInjuryFatalityData} title="Borough Injury and Fatality Severity"             />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisualizationsPage
