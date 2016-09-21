import AppStore from '../stores/AppStore'
export default {
  hideMobileSplashViewer() {
    delete AppStore.data.show_mobile_splash_viewer
    AppStore.emitChange()
  },
  goToBranchLink() {
    window.open(AppStore.data.branch_link)
  }
}