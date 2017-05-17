// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
export default (user_id, rooms) => {
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
    // Add some data
    store.put({ user_id, rooms })
    // Close the db when the transaction is done
    tx.oncomplete = () => {
      db.close()
    }
  }
}