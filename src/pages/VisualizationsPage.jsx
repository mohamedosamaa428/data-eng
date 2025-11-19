import FiltersPanel from '../components/FiltersPanel'
import {
  BarChartPlaceholder,
  LineChartPlaceholder,
  MapChartPlaceholder,
  HeatmapPlaceholder,
  PieChartPlaceholder
} from '../components/charts'

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
            {/* Chart Cards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <BarChartPlaceholder />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <LineChartPlaceholder />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <PieChartPlaceholder />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
              <HeatmapPlaceholder />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 md:col-span-2">
              <MapChartPlaceholder />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisualizationsPage
