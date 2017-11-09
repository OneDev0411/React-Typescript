import AppStore from '../stores/AppStore'
import config from '../../config/public'
export default {
  hideMobileSplashViewer() {
    delete AppStore.data.show_mobile_splash_viewer
    delete AppStore.data.show_listing_panel
    delete AppStore.data.listing_panel
    AppStore.emitChange()
  },
  goToBranchLink() {
    window.location.replace('rechat://')
    setTimeout(() => {
      window.location.replace(config.itunes_url)
    }, 1000)
  }
}