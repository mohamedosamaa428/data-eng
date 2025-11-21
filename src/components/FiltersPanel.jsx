import {
  BoroughDropdown,
  YearDropdown,
  VehicleTypeDropdown,
  ContributingFactorDropdown,
  InjuryTypeDropdown
} from './filters'
import { useFilters } from '../context/FiltersContext'

function FiltersPanel({ position = 'left' }) {
  const {
    borough,
    year,
    vehicleType,
    factor,
    injuryType,
    loading,
    error,
    searchQuery,
    lastAction,
    setBorough,
    setYear,
    setVehicleType,
    setFactor,
    setInjuryType,
    setSearchQuery,
    resetFilters,
    fetchFilteredData,
    runSearchQuery
  } = useFilters()

  const isGeneratingReport = loading && lastAction === 'generate'
  const isSearching = loading && lastAction === 'search'

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      runSearchQuery(searchQuery)
    }
  }

  const containerClass = position === 'left' 
    ? "w-full bg-white h-full overflow-y-auto" 
    : "w-full bg-white border-b border-gray-200";

  const layoutClass = position === 'left'
    ? "flex flex-col space-y-5"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4";

  return (
    <div className={containerClass}>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 pt-5 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Filters</h2>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Refine your data view</p>
          <button
            type="button"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>
      <div className={position === 'left' ? 'px-5 pb-5' : 'p-4'}>
        <div className="mb-4">
          <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
            Search Mode
          </label>
          <div className="relative">
            <input
              id="search-query"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="e.g. Brooklyn 2022 pedestrian crashes"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isSearching && (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Press Enter to run a natural-language search (e.g. &ldquo;Manhattan taxi crashes 2020&rdquo;).
          </p>
          {!isSearching && !isGeneratingReport && error && lastAction === 'search' && (
            <p className="mt-2 text-xs font-medium text-red-600">
              Search failed. Please adjust your query.
            </p>
          )}
        </div>
        <div className={layoutClass}>
          <BoroughDropdown
            placeholder="Select Borough"
            value={borough}
            onChange={(event) => setBorough(event.target.value)}
          />
          <YearDropdown
            placeholder="Select Year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
          <VehicleTypeDropdown
            placeholder="Select Vehicle Type"
            value={vehicleType}
            onChange={(event) => setVehicleType(event.target.value)}
          />
          <ContributingFactorDropdown
            placeholder="Select Contributing Factor"
            value={factor}
            onChange={(event) => setFactor(event.target.value)}
          />
          <InjuryTypeDropdown
            placeholder="Select Injury Type"
            value={injuryType}
            onChange={(event) => setInjuryType(event.target.value)}
          />
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={fetchFilteredData}
            disabled={isGeneratingReport}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isGeneratingReport && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isGeneratingReport ? 'Generating Report...' : 'Generate Report'}
          </button>
          {!isSearching && !isGeneratingReport && error && lastAction === 'generate' && (
            <p className="mt-2 text-xs font-medium text-red-600">
              Failed to generate report. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FiltersPanel
