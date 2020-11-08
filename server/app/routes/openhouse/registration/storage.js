// @ts-nocheck

import * as constants from './constants'

const LOCAL_STORAGE_REGISTERATION_KEY =
  constants.LOCAL_STORAGE_REGISTERATION_KEY

const storage = {
  getAll() {
    return (
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_REGISTERATION_KEY)) || {}
    )
  },

  setAll(value) {
    localStorage.setItem(LOCAL_STORAGE_REGISTERATION_KEY, JSON.stringify(value))
  },

  get(id) {
    const data = this.getAll()

    return data[id] || []
  },

  set(id, value) {
    const data = this.getAll()

    data[id] = value

    localStorage.setItem(LOCAL_STORAGE_REGISTERATION_KEY, JSON.stringify(data))
  },

  remove(id) {
    const data = this.getAll()

    delete data[id]

    this.setAll(data)
  },

  append(id, value) {
    const data = this.get(id)

    if (!Array.isArray(data)) {
      throw new TypeError(`No array type saved in "${id}" key`)
    }

    data.push(value)
    this.set(id, data)
  }
}

export default storage
