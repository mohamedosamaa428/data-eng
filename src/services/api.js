import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')) || ''

const apiClient = axios.create({
  baseURL,
  timeout: 15000
})

function sanitizeParams(params = {}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value
    }
    return acc
  }, {})
}

export function getFilters() {
  return apiClient.get('/filters')
}

export function getFilteredData(params = {}) {
  return apiClient.get('/data', { params: sanitizeParams(params) })
}

export function searchQuery(query) {
  return apiClient.get('/search', { params: { q: query } })
}

export default {
  getFilters,
  getFilteredData,
  searchQuery
}

