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

function VisualizationsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-sm">Data visualizations and analytics</p>
        </div>
        
        {/* Featured Bar Chart - Full Width, Prominent */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8 hover:shadow-md transition-shadow duration-200">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Bar Chart</p>
              <h2 className="text-lg font-semibold text-gray-900">Which borough has the highest number of collisions?</h2>
            </div>
            <div className="w-full" style={{ minHeight: '600px' }}>
              <BoroughBarChart data={[]} title="Borough Bar Chart" />
            </div>
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
            <YearLineChart data={[]} title="Year Line Chart" />
          </div>

          {/* Vehicle Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Pie Chart</p>
              <h3 className="text-lg font-semibold text-gray-900">What percentage of collisions involve each type of vehicle?</h3>
            </div>
            <VehiclePieChart data={[]} title="Vehicle Pie Chart" />
          </div>

          {/* Vehicle Type Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Bar Chart</p>
              <h3 className="text-lg font-semibold text-gray-900">What are the top 10 contributing factors that cause collisions?</h3>
            </div>
            <VehicleTypeBarChart data={[]} title="Vehicle Type Bar Chart" />
          </div>

          {/* Hourly Trend Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Line Chart</p>
              <h3 className="text-lg font-semibold text-gray-900">How do collisions change during the hours of the day?</h3>
            </div>
            <HourlyTrendLineChart data={[]} title="Hourly Trend Line Chart" />
          </div>

          {/* Heatmap Hourly Daily */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Heatmap</p>
              <h3 className="text-lg font-semibold text-gray-900">At what hour and on what day of the week do collisions happen the most?</h3>
            </div>
            <HeatmapHourlyDaily data={[]} title="Heatmap Hourly Daily" />
          </div>

          {/* Injury Severity Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Pie Chart</p>
              <h3 className="text-lg font-semibold text-gray-900">What share does each borough contribute to total collisions?</h3>
            </div>
            <InjurySeverityPieChart data={[]} title="Injury Severity Distribution" />
          </div>

          {/* Monthly Borough Heatmap */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Heatmap</p>
              <h3 className="text-lg font-semibold text-gray-900">Which combinations of vehicle type and contributing factor appear together most often?</h3>
            </div>
            <MonthlyBoroughHeatmap data={[]} title="Monthly Borough Heatmap" />
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
            <CrashMap data={[]} title="Crash Map" />
          </div>

          {/* Crash Density Map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Map</p>
              <h3 className="text-lg font-semibold text-gray-900">Which boroughs have the highest injury and fatality locations?</h3>
            </div>
            <CrashDensityMap data={[]} title="Crash Density Map" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisualizationsPage
