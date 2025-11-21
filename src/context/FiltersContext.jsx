import { createContext, useContext } from 'react'

const FiltersContext = createContext(null)

export function useFilters() {
  const context = useContext(FiltersContext)

  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider')
  }

  return context
}

export default FiltersContext

