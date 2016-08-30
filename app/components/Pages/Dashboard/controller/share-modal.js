// controller/share-modal.js
import AppStore from '../../../../stores/AppStore'
const controller = {
  addUsersToSearchInput(items_selected) {
    if (!items_selected && AppStore.data.share_modal) {
      delete AppStore.data.share_modal.items_selected
      AppStore.emitChange()
      return
    }
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    AppStore.data.share_modal.items_selected = items_selected
    AppStore.emitChange()
  },
  handleInputChange(value) {
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    AppStore.data.share_modal.search_value = value
    AppStore.emitChange()
  }
}
export default controller