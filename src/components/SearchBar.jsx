import { useState } from 'react'

function SearchBar({ value, onChange, onSearch, onClear, placeholder = "Search: e.g., 'Brooklyn 2022 pedestrian crashes'" }) {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch && onSearch()
    }
  }

  return (
    <div className="relative w-full mb-4">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 pr-24 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {value && (
            <button
              onClick={onClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors mr-2"
              title="Clear search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <button
            onClick={onSearch}
            disabled={!value.trim()}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </div>
      </div>
      {isFocused && (
        <div className="mt-2 text-xs text-gray-500">
          <p>💡 Try: "Brooklyn 2022 pedestrian crashes" or "Queens taxi accidents 2021"</p>
        </div>
      )}
    </div>
  )
}

export default SearchBar

