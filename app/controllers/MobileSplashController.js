import AppStore from '../stores/AppStore'
import { itunes_url } from '../../config/public'
import ListingDispatcher from '../dispatcher/ListingDispatcher'
export default {
  hideMobileSplashViewer() {
    delete AppStore.data.show_mobile_splash_viewer
    delete AppStore.data.show_listing_panel
    delete AppStore.data.listing_panel
    AppStore.emitChange()
  },
  goToBranchLink() {
    window.open('rechat://')
    setTimeout(() => { window.open(itunes_url) }, 25)
  }
}