// actions/check-for-mobile.js
import AppStore from '../../stores/AppStore'
export default () => {
  if (typeof window !== 'undefined' && window.innerWidth < 450) {
    AppStore.data.is_mobile = true
    AppStore.emitChange()
  }
}