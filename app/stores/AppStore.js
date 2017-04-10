// AppStore.js
import { EventEmitter } from 'events'
import _ from 'lodash'

export default _.extend({}, EventEmitter.prototype, {
  // Initial data
  data: {
    ready: false
  },

  // Emit Change event
  emitChange(namespace = '') {
    this.emit('change', { namespace })
  },

  // Add change listener
  addChangeListener(callback) {
    this.on('change', callback)
  },

  // Remove change listener
  removeChangeListener(callback) {
    this.removeListener('change', callback)
  }
})
