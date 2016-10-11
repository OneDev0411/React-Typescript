import AppStore from '../stores/AppStore'
import { itunes_url } from '../../config/public'
export default {
  hideMobileSplashViewer() {
    delete AppStore.data.show_mobile_splash_viewer
    AppStore.emitChange()
  },
  goToBranchLink() {
    window.open('rechat://')
    setTimeout(() => { window.open(itunes_url) }, 25)
  }
}