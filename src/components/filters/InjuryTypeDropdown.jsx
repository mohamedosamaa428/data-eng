function InjuryTypeDropdown({ placeholder = "Select Injury Type", ...props }) {
  return (
    <div>
      <label htmlFor="injury-type" className="block text-sm font-medium text-gray-700 mb-2">
        Injury Type
      </label>
      <select
        id="injury-type"
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm transition-all duration-200 hover:border-gray-400"
        {...props}
      >
        <option value="">{placeholder}</option>
      </select>
    </div>
  )
}

export default InjuryTypeDropdown

