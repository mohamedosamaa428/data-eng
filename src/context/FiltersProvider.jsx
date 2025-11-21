import { useReducer, useMemo, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import FiltersContext from './FiltersContext'
import { getFilteredData, searchQuery as searchQueryRequest } from '../services/api'
import parseSearchQuery from '../utils/parseSearchQuery'

const ACTIONS = {
  SET_BOROUGH: 'SET_BOROUGH',
  SET_YEAR: 'SET_YEAR',
  SET_VEHICLE_TYPE: 'SET_VEHICLE_TYPE',
  SET_FACTOR: 'SET_FACTOR',
  SET_INJURY_TYPE: 'SET_INJURY_TYPE',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_FILTERED_DATA: 'SET_FILTERED_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_LAST_ACTION: 'SET_LAST_ACTION',
  RESET: 'RESET'
}

const initialState = {
  borough: '',
  year: '',
  vehicleType: '',
  factor: '',
  injuryType: '',
  searchQuery: '',
  filteredData: [],
  loading: false,
  error: '',
  lastAction: ''
}

function filtersReducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case ACTIONS.SET_BOROUGH:
      return { ...state, borough: payload }
    case ACTIONS.SET_YEAR:
      return { ...state, year: payload }
    case ACTIONS.SET_VEHICLE_TYPE:
      return { ...state, vehicleType: payload }
    case ACTIONS.SET_FACTOR:
      return { ...state, factor: payload }
    case ACTIONS.SET_INJURY_TYPE:
      return { ...state, injuryType: payload }
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: payload }
    case ACTIONS.SET_FILTERED_DATA:
      return { ...state, filteredData: payload }
    case ACTIONS.SET_LOADING:
      return { ...state, loading: Boolean(payload) }
    case ACTIONS.SET_ERROR:
      return { ...state, error: payload ?? '' }
    case ACTIONS.SET_LAST_ACTION:
      return { ...state, lastAction: payload ?? '' }
    case ACTIONS.RESET:
      return { ...initialState }
    default:
      return state
  }
}

function FiltersProvider({ children }) {
  const [state, dispatch] = useReducer(filtersReducer, initialState)
  const { borough, year, vehicleType, factor, injuryType } = state

  const setBorough = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_BOROUGH, payload: value }),
    []
  )
  const setYear = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_YEAR, payload: value }),
    []
  )
  const setVehicleType = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_VEHICLE_TYPE, payload: value }),
    []
  )
  const setFactor = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_FACTOR, payload: value }),
    []
  )
  const setInjuryType = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_INJURY_TYPE, payload: value }),
    []
  )
  const setSearchQuery = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: value }),
    []
  )
  const setFilteredData = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_FILTERED_DATA, payload: value }),
    []
  )
  const setLoading = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_LOADING, payload: value }),
    []
  )
  const setError = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_ERROR, payload: value }),
    []
  )
  const setLastAction = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_LAST_ACTION, payload: value }),
    []
  )
  const resetFilters = useCallback(
    () => dispatch({ type: ACTIONS.RESET }),
    []
  )

  useEffect(() => {
    let isMounted = true

    async function loadInitialData() {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.SET_ERROR, payload: '' })

      try {
        const response = await getFilteredData({})
        if (!isMounted) return
        dispatch({
          type: ACTIONS.SET_FILTERED_DATA,
          payload: response?.data ?? []
        })
      } catch (error) {
        if (!isMounted) return
        const message =
          error?.response?.data?.message ??
          error?.message ??
          'Unable to load data right now.'
        dispatch({ type: ACTIONS.SET_ERROR, payload: message })
      } finally {
        if (!isMounted) return
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    }

    loadInitialData()

    return () => {
      isMounted = false
    }
  }, [])

  const fetchFilteredData = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LAST_ACTION, payload: 'generate' })
    dispatch({ type: ACTIONS.SET_LOADING, payload: true })
    dispatch({ type: ACTIONS.SET_ERROR, payload: '' })

    try {
      const response = await getFilteredData({
        borough,
        year,
        vehicle: vehicleType,
        factor,
        injury: injuryType
      })

      dispatch({
        type: ACTIONS.SET_FILTERED_DATA,
        payload: response?.data ?? []
      })
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Unable to generate the report right now.'
      dispatch({ type: ACTIONS.SET_ERROR, payload: message })
      dispatch({ type: ACTIONS.SET_FILTERED_DATA, payload: [] })
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false })
    }
  }, [borough, year, vehicleType, factor, injuryType])

  const runSearchQuery = useCallback(
    async (query = '') => {
      const trimmedQuery = query.trim()

      if (!trimmedQuery) {
        return
      }

      dispatch({ type: ACTIONS.SET_LAST_ACTION, payload: 'search' })
      setSearchQuery(trimmedQuery)

      const parsed = parseSearchQuery(trimmedQuery)

      setBorough(parsed.borough ?? '')
      setYear(parsed.year ?? '')
      setVehicleType(parsed.vehicleType ?? '')
      setFactor(parsed.factor ?? '')
      setInjuryType(parsed.injuryType ?? '')

      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: ACTIONS.SET_ERROR, payload: '' })

      try {
        const response = await searchQueryRequest(trimmedQuery)

        dispatch({
          type: ACTIONS.SET_FILTERED_DATA,
          payload: response?.data ?? []
        })
      } catch (error) {
        const message =
          error?.response?.data?.message ??
          error?.message ??
          'Unable to process the search right now.'
        dispatch({ type: ACTIONS.SET_ERROR, payload: message })
        dispatch({ type: ACTIONS.SET_FILTERED_DATA, payload: [] })
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      }
    },
    [setSearchQuery, setBorough, setYear, setVehicleType, setFactor, setInjuryType]
  )

  const contextValue = useMemo(
    () => ({
      ...state,
      setBorough,
      setYear,
      setVehicleType,
      setFactor,
      setInjuryType,
      setSearchQuery,
      setFilteredData,
      setLoading,
      setError,
      setLastAction,
      resetFilters,
      fetchFilteredData,
      runSearchQuery,
      parseSearchQuery
    }),
    [
      state,
      setBorough,
      setYear,
      setVehicleType,
      setFactor,
      setInjuryType,
      setSearchQuery,
      setFilteredData,
      setLoading,
      setError,
      setLastAction,
      resetFilters,
      fetchFilteredData,
      runSearchQuery,
      parseSearchQuery
    ]
  )

  return (
    <FiltersContext.Provider value={contextValue}>
      {children}
    </FiltersContext.Provider>
  )
}

FiltersProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default FiltersProvider

