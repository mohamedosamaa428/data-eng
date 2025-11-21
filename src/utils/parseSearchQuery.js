const BOROUGH_MAP = {
  manhattan: 'MANHATTAN',
  brooklyn: 'BROOKLYN',
  queens: 'QUEENS',
  bronx: 'BRONX',
  'staten island': 'STATEN ISLAND'
}

const VEHICLE_KEYWORDS = {
  taxi: 'TAXI',
  cab: 'TAXI',
  sedan: 'SEDAN',
  car: 'PASSENGER VEHICLE',
  bus: 'BUS',
  bicycle: 'BICYCLE',
  bike: 'BICYCLE',
  cyclist: 'BICYCLE',
  motorcycle: 'MOTORCYCLE',
  motorbike: 'MOTORCYCLE'
}

const INJURY_KEYWORDS = {
  pedestrian: 'PEDESTRIAN',
  cyclist: 'CYCLIST',
  bicyclist: 'CYCLIST',
  motorist: 'MOTORIST'
}

const FACTOR_KEYWORDS = {
  alcohol: 'ALCOHOL',
  distraction: 'DISTRACTION',
  weather: 'WEATHER',
  speeding: 'SPEEDING'
}

const YEAR_REGEX = /\b(201[2-9]|202[0-5])\b/

function findMatch(source, mapping) {
  for (const [keyword, value] of Object.entries(mapping)) {
    if (source.includes(keyword)) {
      return value
    }
  }
  return ''
}

export default function parseSearchQuery(rawQuery = '') {
  const query = rawQuery.trim().toLowerCase()

  if (!query) {
    return {
      borough: '',
      year: '',
      vehicleType: '',
      injuryType: '',
      factor: ''
    }
  }

  const borough =
    Object.entries(BOROUGH_MAP).find(([name]) =>
      query.includes(name)
    )?.[1] ?? ''

  const year = query.match(YEAR_REGEX)?.[0] ?? ''
  const vehicleType = findMatch(query, VEHICLE_KEYWORDS)
  const injuryType = findMatch(query, INJURY_KEYWORDS)
  const factor = findMatch(query, FACTOR_KEYWORDS)

  return {
    borough,
    year,
    vehicleType,
    injuryType,
    factor
  }
}

