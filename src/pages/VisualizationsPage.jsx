import {
  BoroughBarChart,
  YearLineChart,
  CrashMap,
  HeatmapHourlyDaily,
  VehiclePieChart,
  VehicleTypeBarChart,
  HourlyTrendLineChart,
  InjurySeverityPieChart,
  MonthlyBoroughHeatmap,
  CrashDensityMap
} from '../charts'
import { useFilters } from '../context/FiltersContext'

function ChartWrapper({ children, loading, error }) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 rounded-xl bg-white/75 backdrop-blur-sm flex flex-col items-center justify-center text-sm font-medium text-gray-700">
          <span className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Loading data...
        </div>
      )}
      {!loading && error && (
        <div className="absolute inset-0 rounded-xl bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6">
          <p className="text-sm font-semibold text-red-600">Unable to render chart</p>
          <p className="mt-1 text-xs text-red-500">{error}</p>
        </div>
      )}
    </div>
  )
}

function VisualizationsPage() {
  const { filteredData, error, loading } = useFilters()
  const hasData = Array.isArray(filteredData) && filteredData.length > 0

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-sm">Data visualizations and analytics</p>
        </div>
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {!loading && !hasData && !error && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-center text-sm text-amber-900">
            No data found. Try different filters or run a new report.
          </div>
        )}
        
        {/* Featured Bar Chart - Full Width, Prominent */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Bar Chart</p>
              <h2 className="text-lg font-semibold text-gray-900">Which borough has the highest number of collisions?</h2>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <div className="w-full" style={{ minHeight: '600px' }}>
                <BoroughBarChart data={filteredData} title="Borough Bar Chart" />
              </div>
            </ChartWrapper>
          </div>
        </div>

        {/* Secondary Charts - Single Column Layout */}
        <div className="space-y-6 mb-8">
          {/* Year Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Line Chart</p>
              <h3 className="text-lg font-semibold text-gray-900">How do collisions change month-by-month over the years?</h3>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <YearLineChart data={filteredData} title="Year Line Chart" />
            </ChartWrapper>
          </div>

          {/* Vehicle Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Pie Chart</p>
              <h3 className="text-lg font-semibold text-gray-900">What percentage of collisions involve each type of vehicle?</h3>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <VehiclePieChart data={filteredData} title="Vehicle Pie Chart" />
            </ChartWrapper>
          </div>

          {/* Vehicle Type Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Bar Chart</p>
              <h3 className="text-lg font-semibold text-gray-900">What are the top 10 contributing factors that cause collisions?</h3>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <VehicleTypeBarChart data={filteredData} title="Vehicle Type Bar Chart" />
            </ChartWrapper>
          </div>

          {/* Hourly Trend Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Line Chart</p>
              <h3 className="text-lg font-semibold text-gray-900">How do collisions change during the hours of the day?</h3>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <HourlyTrendLineChart data={filteredData} title="Hourly Trend Line Chart" />
            </ChartWrapper>
          </div>

          {/* Heatmap Hourly Daily */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Heatmap</p>
              <h3 className="text-lg font-semibold text-gray-900">At what hour and on what day of the week do collisions happen the most?</h3>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <HeatmapHourlyDaily data={filteredData} title="Heatmap Hourly Daily" />
            </ChartWrapper>
          </div>

          {/* Injury Severity Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Pie Chart</p>
              <h3 className="text-lg font-semibold text-gray-900">What share does each borough contribute to total collisions?</h3>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <InjurySeverityPieChart data={filteredData} title="Injury Severity Distribution" />
            </ChartWrapper>
          </div>

          {/* Monthly Borough Heatmap */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Heatmap</p>
              <h3 className="text-lg font-semibold text-gray-900">Which combinations of vehicle type and contributing factor appear together most often?</h3>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <MonthlyBoroughHeatmap data={filteredData} title="Monthly Borough Heatmap" />
            </ChartWrapper>
          </div>
        </div>

        {/* Maps Section - Full Width */}
        <div className="space-y-6">
          {/* Crash Map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Map</p>
              <h3 className="text-lg font-semibold text-gray-900">Where are collision hotspots located across NYC?</h3>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <CrashMap data={filteredData} title="Crash Map" />
            </ChartWrapper>
          </div>

          {/* Crash Density Map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Map</p>
              <h3 className="text-lg font-semibold text-gray-900">Which boroughs have the highest injury and fatality locations?</h3>
            </div>
            <ChartWrapper loading={loading} error={error}>
              <CrashDensityMap data={filteredData} title="Crash Density Map" />
            </ChartWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisualizationsPage
