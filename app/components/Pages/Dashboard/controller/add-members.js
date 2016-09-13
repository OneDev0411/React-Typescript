// controller/add-members.js
import AppStore from '../../../../stores/AppStore'
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
  handleInputChange(value) {
    if (!AppStore.data.add_members)
      AppStore.data.add_members = {}
    AppStore.data.add_members.search_value = value
    AppStore.emitChange()
  }
}
export default controller