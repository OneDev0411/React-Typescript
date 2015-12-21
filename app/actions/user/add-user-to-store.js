// actions/add-user-to-store.js
import AppStore from '../../stores/AppStore'

export default (user) => {
  
  AppStore.data.user = user
  AppStore.emitChange()
  
}