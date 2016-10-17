// controller/add-members.js
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
import _ from 'lodash'
const controller = {
  addUsersToSearchInput(items_selected) {
    if (!items_selected && AppStore.data.add_members || !items_selected.length && AppStore.data.add_members) {
      delete AppStore.data.add_members.items_selected
      AppStore.emitChange()
      return
    }
    items_selected.forEach(item => {
      if (item.type === 'room') {
        const users = item.value.users
        users.forEach(user => {
          items_selected.push({
            label: user.first_name || user.display_name,
            value: user,
            type: 'user'
          })
        })
      }
    })
    // Make unique
    AppStore.data.add_members = {
      items_selected
    }
    AppStore.emitChange()
  },
  searchUsers(q) {
    const user = AppStore.data.user
    AppDispatcher.dispatch({
      action: 'search-users-add-members',
      user,
      q
    })
  },
  handleInputChange(value) {
    if (!AppStore.data.add_members)
      AppStore.data.add_members = {}
    AppStore.data.add_members.search_value = value
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