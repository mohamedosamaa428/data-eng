import {
  BoroughDropdown,
  YearDropdown,
  VehicleTypeDropdown,
  ContributingFactorDropdown,
  InjuryTypeDropdown
} from './filters'

function FiltersPanel({ position = 'left' }) {
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
        <p className="text-xs text-gray-500">Refine your data view</p>
      </div>
      <div className={position === 'left' ? 'px-5 pb-5' : 'p-4'}>
        <div className={layoutClass}>
          <BoroughDropdown placeholder="Select Borough" />
          <YearDropdown placeholder="Select Year" />
          <VehicleTypeDropdown placeholder="Select Vehicle Type" />
          <ContributingFactorDropdown placeholder="Select Contributing Factor" />
          <InjuryTypeDropdown placeholder="Select Injury Type" />
        </div>
      </div>
    </div>
  )
}

export default FiltersPanel
