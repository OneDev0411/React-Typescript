// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
import AppStore from '../../stores/AppStore'
export default (user_id) => {
  const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB
  // Open (or create) the database
  const open = indexedDB.open('RechatDB', 1)
  // Create the schema
  open.onupgradeneeded = () => {
    const db = open.result
    db.createObjectStore('rooms', { keyPath: 'user_id' })
  }
  open.onsuccess = () => {
    // Start a new transaction
    const db = open.result
    const tx = db.transaction('rooms', 'readwrite')
    const store = tx.objectStore('rooms')
    // Query the data
    const get_rooms = store.get(user_id)
    get_rooms.onsuccess = () => {
      if (get_rooms.result) {
        const rooms = get_rooms.result.rooms
        AppStore.data.rooms = rooms
        AppStore.emitChange()
      }
    }
    // Close the db when the transaction is done
    tx.oncomplete = () => {
      db.close()
    }
  }
}