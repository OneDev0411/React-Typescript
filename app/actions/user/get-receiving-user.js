// actions/get-receiving-user.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user_id) => {
  const params = {
    access_token: null,
    id: user_id
  }
  User.get(params, (err, res) => {
    AppStore.data.receiving_user = res.data
    AppStore.emitChange()
  })
}