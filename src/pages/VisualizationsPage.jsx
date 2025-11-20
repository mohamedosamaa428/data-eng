import FiltersPanel from '../components/FiltersPanel'
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

// Research questions for each chart
const chartResearchQuestions = {
  BoroughBarChart: [
    'Which borough has the highest number of collisions?'
  ],
  YearLineChart: [
    'How do collisions change month-by-month over the years?',
    'How do collisions change during the hours of the day?'
  ],
  VehiclePieChart: [
    'What percentage of collisions involve each type of vehicle?',
    'What share does each borough contribute to total collisions?'
  ],
  HeatmapHourlyDaily: [
    'At what hour and on what day of the week do collisions happen the most?',
    'Which combinations of vehicle type and contributing factor appear together most often?'
  ],
  CrashMap: [
    'Where are collision hotspots located across NYC?',
    'Which boroughs have the highest injury and fatality locations?'
  ],
  VehicleTypeBarChart: [
    'What are the top 10 contributing factors that cause collisions?'
  ],
  HourlyTrendLineChart: [
    'How do collisions change month-by-month over the years?',
    'How do collisions change during the hours of the day?'
  ],
  InjurySeverityPieChart: [
    'What percentage of collisions involve each type of vehicle?',
    'What share does each borough contribute to total collisions?'
  ],
  MonthlyBoroughHeatmap: [
    'At what hour and on what day of the week do collisions happen the most?',
    'Which combinations of vehicle type and contributing factor appear together most often?'
  ],
  CrashDensityMap: [
    'Where are collision hotspots located across NYC?',
    'Which boroughs have the highest injury and fatality locations?'
  ]
}

function VisualizationsPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Filters Panel - Left side on desktop, top on mobile */}
      <div className="lg:w-72 xl:w-80 flex-shrink-0 border-r border-gray-200 lg:border-b-0 border-b">
        <FiltersPanel position="left" />
      </div>

      {/* Charts Grid - Right side on desktop, bottom on mobile */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 text-sm">Data visualizations and analytics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Borough Bar Chart */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Bar Chart</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Research Questions:</h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                  {chartResearchQuestions.BoroughBarChart.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
              <BoroughBarChart data={[]} title="Borough Bar Chart" />
              </div>
            </div>

            {/* Year Line Chart */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Line Chart</span>
                </div>
                <p className="text-sm font-medium text-gray-800">How do collisions change month-by-month over the years?</p>
              </div>
              <YearLineChart data={[]} title="Year Line Chart" />
              </div>
            </div>

            {/* Vehicle Pie Chart */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Pie Chart</span>
                </div>
                <p className="text-sm font-medium text-gray-800">What percentage of collisions involve each type of vehicle?</p>
              </div>
              <VehiclePieChart data={[]} title="Vehicle Pie Chart" />
              </div>
            </div>

            {/* Heatmap Hourly Daily */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Heatmap</span>
                </div>
                <p className="text-sm font-medium text-gray-800">At what hour and on what day of the week do collisions happen the most?</p>
              </div>
              <HeatmapHourlyDaily data={[]} title="Heatmap Hourly Daily" />
              </div>
            </div>

            {/* Vehicle Type Bar Chart */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Bar Chart</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Research Questions:</h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                  {chartResearchQuestions.VehicleTypeBarChart.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
              <VehicleTypeBarChart data={[]} title="Vehicle Type Bar Chart" />
              </div>
            </div>

            {/* Hourly Trend Line Chart */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Line Chart</span>
                </div>
                <p className="text-sm font-medium text-gray-800">How do collisions change during the hours of the day?</p>
              </div>
              <HourlyTrendLineChart data={[]} title="Hourly Trend Line Chart" />
              </div>
            </div>

            {/* Injury Severity Pie Chart */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Pie Chart</span>
                </div>
                <p className="text-sm font-medium text-gray-800">What share does each borough contribute to total collisions?</p>
              </div>
              <InjurySeverityPieChart data={[]} title="Injury Severity Distribution" />
              </div>
            </div>

            {/* Monthly Borough Heatmap */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Heatmap</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Which combinations of vehicle type and contributing factor appear together most often?</p>
              </div>
              <MonthlyBoroughHeatmap data={[]} title="Monthly Borough Heatmap" />
              </div>
            </div>

            {/* Crash Map */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 md:col-span-2">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Map</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Where are collision hotspots located across NYC?</p>
              </div>
              <CrashMap data={[]} title="Crash Map" />
              </div>
            </div>

            {/* Crash Density Map */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 md:col-span-2">
              <div className="mb-4">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Map</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Which boroughs have the highest injury and fatality locations?</p>
              </div>
              <CrashDensityMap data={[]} title="Crash Density Map" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisualizationsPage
