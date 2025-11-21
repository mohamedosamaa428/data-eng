import { useState, useEffect } from 'react'
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

function VisualizationsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    borough: 'All Boroughs',
    year: 'All Years',
    vehicleType: 'All Vehicles'
  })
  const [filteredData, setFilteredData] = useState([])
  const [debugMode, setDebugMode] = useState(false)

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

  const handleGenerateReport = () => {
    if (!data || data.length === 0) {
      console.log('No data available to filter')
      setFilteredData([])
      return
    }

    // Start with a copy of all data
    let filtered = [...data]
    const originalLength = filtered.length

    // Log applied filters
    console.group('🔍 Filtering Data')
    console.log('Applied Filters:', {
      borough: filters.borough,
      year: filters.year,
      vehicleType: filters.vehicleType
    })
    console.log('Original data length:', originalLength)

    // Apply borough filter
    if (filters.borough !== 'All Boroughs') {
      const beforeBorough = filtered.length
      filtered = filtered.filter(row => {
        const borough = row.BOROUGH || row['BOROUGH']
        return borough === filters.borough
      })
      console.log(`Borough filter (${filters.borough}): ${beforeBorough} → ${filtered.length}`)
    }

    // Apply year filter
    if (filters.year !== 'All Years') {
      const beforeYear = filtered.length
      filtered = filtered.filter(row => {
        const crashDate = row.CRASH_DATE || row['CRASH DATE']
        if (!crashDate) return false

        // Parse CRASH_DATE to get year (format: MM/DD/YYYY)
        let year = null
        if (typeof crashDate === 'string') {
          const dateParts = crashDate.split('/')
          if (dateParts.length >= 3) {
            year = dateParts[2]?.substring(0, 4)
          }
        } else if (crashDate instanceof Date) {
          year = String(crashDate.getFullYear())
        }

        return String(year) === String(filters.year)
      })
      console.log(`Year filter (${filters.year}): ${beforeYear} → ${filtered.length}`)
    }

    // Apply vehicle type filter
    if (filters.vehicleType !== 'All Vehicles') {
      const beforeVehicle = filtered.length
      filtered = filtered.filter(row => {
        const vehicle1 = row.VEHICLE_TYPE_CODE_1 || row['VEHICLE TYPE CODE 1']
        const vehicle2 = row.VEHICLE_TYPE_CODE_2 || row['VEHICLE TYPE CODE 2']
        return vehicle1 === filters.vehicleType || vehicle2 === filters.vehicleType
      })
      console.log(`Vehicle type filter (${filters.vehicleType}): ${beforeVehicle} → ${filtered.length}`)
    }

    // Set filtered data
    setFilteredData(filtered)

    // Log filtering results
    console.log(`Final result: ${originalLength} → ${filtered.length} rows`)
    console.groupEnd()
    
    if (filtered.length === 0) {
      console.warn('No data matches these filters')
      alert('No data matches these filters. Please adjust your selection.')
    }
  }

  // Use filteredData if it exists, otherwise use all data
  const displayData = filteredData.length > 0 ? filteredData : data

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
        
        {/* Filters Container */}
        <div className="filters-container mb-8">
          <label className="text-sm font-semibold text-gray-700">Filter Data:</label>
          
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

          {/* Generate Report Button */}
          <button
            onClick={handleGenerateReport}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
          >
            Generate Report
          </button>

          {/* Debug Mode Toggle */}
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 cursor-pointer ${
              debugMode
                ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
            }`}
          >
            {debugMode ? '🔍 Debug ON' : '🔍 Debug OFF'}
          </button>
        </div>

        {/* Debug Statistics Panel */}
        {debugMode && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">📊 Debug Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Total Data Rows:</strong> {data.length.toLocaleString()}
              </div>
              <div>
                <strong>Filtered Data Rows:</strong> {filteredData.length > 0 ? filteredData.length.toLocaleString() : 'None (showing all)'}
              </div>
              <div>
                <strong>Display Data Rows:</strong> {displayData.length.toLocaleString()}
              </div>
              <div>
                <strong>Active Filters:</strong> {
                  [
                    filters.borough !== 'All Boroughs' ? `Borough: ${filters.borough}` : null,
                    filters.year !== 'All Years' ? `Year: ${filters.year}` : null,
                    filters.vehicleType !== 'All Vehicles' ? `Vehicle: ${filters.vehicleType}` : null
                  ].filter(Boolean).join(', ') || 'None'
                }
              </div>
              <div>
                <strong>Memory Usage:</strong> {
                  performance.memory
                    ? `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`
                    : 'N/A'
                }
              </div>
              <div>
                <strong>Chart Data Status:</strong> {
                  displayData.length > 0 ? '✅ Ready' : '⏳ Loading'
                }
              </div>
            </div>
          </div>
        )}
        
        {/* Research Questions Section */}
        <div className="research-questions space-y-8">
          {/* QUESTION 1 (Bar Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 1</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Which borough has the highest number of collisions?</h3>
            <Plot
              data={[processBoroughCollisions(displayData)]}
              layout={{
                title: 'Total Collisions by Borough',
                xaxis: { title: 'Borough' },
                yaxis: { title: 'Number of Collisions' },
                height: 400
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals that [borough] has the highest collision rate with X crashes...</p>
            </div>
          </div>

          {/* QUESTION 2 (Bar Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 2</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">What are the top 10 contributing factors that cause collisions?</h3>
            <Plot
              data={[processTopContributingFactors(displayData)]}
              layout={{
                title: 'Top 10 Contributing Factors to Collisions',
                xaxis: { title: 'Number of Collisions' },
                yaxis: { title: 'Contributing Factor' },
                height: 500
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals key contributing factors...</p>
            </div>
          </div>

          {/* QUESTION 3 (Line Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 3</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">How do collisions change month-by-month over the years?</h3>
            <Plot
              data={[processMonthlyTrend(displayData)]}
              layout={{
                title: 'Monthly Collision Trends Over Time',
                xaxis: { title: 'Month-Year' },
                yaxis: { title: 'Number of Collisions' },
                height: 400
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals monthly trends...</p>
            </div>
          </div>

          {/* QUESTION 4 (Line Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 4</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">How do collisions change during the hours of the day?</h3>
            <Plot
              data={[processHourlyTrend(displayData)]}
              layout={{
                title: 'Collisions Throughout the Day',
                xaxis: { title: 'Hour of Day (0-23)' },
                yaxis: { title: 'Number of Collisions' },
                height: 400
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals hourly patterns...</p>
            </div>
          </div>

          {/* QUESTION 5 (Pie Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 5</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">What percentage of collisions involve each type of vehicle?</h3>
            <Plot
              data={[processVehicleTypeDistribution(displayData)]}
              layout={{
                title: 'Vehicle Type Distribution in Collisions',
                height: 500
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals vehicle type distribution...</p>
            </div>
          </div>

          {/* QUESTION 6 (Pie Chart) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 6</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">What share does each borough contribute to total collisions?</h3>
            <Plot
              data={[processBoroughDistribution(displayData)]}
              layout={{
                title: 'Borough Share of Total Collisions',
                height: 500
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals borough distribution...</p>
            </div>
          </div>

          {/* QUESTION 7 (Heatmap) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 7</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">At what hour and on what day of the week do collisions happen the most?</h3>
            <Plot
              data={[processHourDayHeatmap(displayData)]}
              layout={{
                title: 'Collision Heatmap: Day of Week vs Hour',
                xaxis: { title: 'Hour of Day' },
                yaxis: { title: 'Day of Week' },
                height: 500
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals peak collision times...</p>
            </div>
          </div>

          {/* QUESTION 8 (Heatmap) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 8</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Which combinations of vehicle type and contributing factor appear together most often?</h3>
            <Plot
              data={[processVehicleFactorHeatmap(displayData)]}
              layout={{
                title: 'Vehicle Type vs Contributing Factor Heatmap',
                xaxis: { title: 'Contributing Factor' },
                yaxis: { title: 'Vehicle Type' },
                height: 600
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals vehicle-factor combinations...</p>
            </div>
          </div>

          {/* QUESTION 9 (Map) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 9</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Where are collision hotspots located across NYC?</h3>
            <Plot
              data={[processCollisionHotspots(displayData)]}
              layout={{
                title: 'NYC Collision Hotspots',
                mapbox: { 
                  style: 'open-street-map',
                  center: { lat: 40.7128, lon: -74.0060 },
                  zoom: 10
                },
                height: 600,
                margin: { l: 0, r: 0, t: 40, b: 0 }
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals collision hotspots...</p>
            </div>
          </div>

          {/* QUESTION 10 (Map) */}
          <div className="question-section bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Question 10</h2>
            <h4 className="text-sm text-gray-600 mb-4">Team Member: [Name]</h4>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Which boroughs have the highest injury and fatality locations?</h3>
            <Plot
              data={[processInjuryFatalityMap(displayData)]}
              layout={{
                title: 'Injury and Fatality Hotspots by Borough',
                mapbox: { 
                  style: 'open-street-map',
                  center: { lat: 40.7128, lon: -74.0060 },
                  zoom: 10
                },
                height: 600,
                margin: { l: 0, r: 0, t: 40, b: 0 }
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="findings mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Findings:</h3>
              <p className="text-gray-700">Analysis reveals injury and fatality hotspots...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisualizationsPage
