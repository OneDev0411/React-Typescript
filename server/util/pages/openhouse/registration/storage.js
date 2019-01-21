import { LOCAL_STORAGE_REGISTERATION_KEY } from './constants'

function getAll() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_REGISTERATION_KEY)) || {}
}

function setAll(value) {
  localStorage.setItem(LOCAL_STORAGE_REGISTERATION_KEY, JSON.stringify(value))
}

function get(id) {
  const data = getAll()

  return data[id] || []
}

function set(id, value) {
  const data = getAll()

  data[id] = value

  localStorage.setItem(LOCAL_STORAGE_REGISTERATION_KEY, JSON.stringify(data))
}

function remove(id) {
  const data = getAll()

  delete data[id]

  setAll(data)
}

function append(id, value) {
  const data = get(id)

  data.push(value)
  set(id, data)
}

export default {
  getAll,
  setAll,
  get,
  remove,
  set,
  append
}
