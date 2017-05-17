// controller/share-modal.js
import AppStore from '../../../../stores/AppStore'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import _ from 'lodash'
const controller = {
  addUsersToSearchInput(items_selected) {
    if (!items_selected && AppStore.data.share_modal) {
      delete AppStore.data.share_modal.items_selected
      AppStore.emitChange()
      return
    }
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    // AppStore.data.share_modal.items_selected = items_selected
    items_selected.forEach((item) => {
      if (item.type === 'room') {
        const users = item.value.users
        users.forEach((user) => {
          items_selected.push({
            label: user.first_name || user.display_name,
            value: user,
            type: 'user'
          })
        })
      }
    })
    let filtered_items_selected
    // Filter out rooms
    filtered_items_selected = items_selected.filter(item => item.type !== 'room')
    // Filter out self
    filtered_items_selected = filtered_items_selected.filter(item => item.value.id !== AppStore.data.user.id)
    // Make unique if existing
    const unique_items_selected = []
    filtered_items_selected.forEach((item) => {
      if (item.value.id) {
        if (!_.find(unique_items_selected, { 'value.id': item.value.id }))
          unique_items_selected.push(item)
      } else
        unique_items_selected.push(item)
    })
    AppStore.data.share_modal.items_selected = unique_items_selected
    AppStore.emitChange()
  },
  searchUsers(q) {
    const user = AppStore.data.user
    AppDispatcher.dispatch({
      action: 'search-users-share',
      user,
      q
    })
  },
  handleInputChange(value) {
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    AppStore.data.share_modal.search_value = value
    AppStore.emitChange()
    // Debounce
    if (window.is_typing_timeout) {
      clearTimeout(window.is_typing_timeout)
      delete window.is_typing_timeout
    }
    // Send stopped typing event
    window.is_typing_timeout = setTimeout(() => {
      controller.searchUsers(value)
    }, 1000)
  }
}
export default controller