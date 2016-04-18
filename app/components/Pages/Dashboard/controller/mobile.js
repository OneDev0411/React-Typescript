// controller/mobile.js
import AppStore from '../../../../stores/AppStore'
const controller = {
  checkForMobile() {
    if (typeof window !== 'undefined' && window.innerWidth < 450) {
      AppStore.data.is_mobile = true
      AppStore.emitChange()
    }
  }
}
export default controller