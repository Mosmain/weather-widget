const STORAGE_KEY = 'weather_cities'

export function loadCities() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveCities(cities: Array<{ id: number; name: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
}
