// actions/get-receiving-user.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default user_id => {
  const params = {
    access_token: null,
    id: user_id
  }
  User.get(params, (err, res) => {
    // Success
    if (res.status === 'success') {
      AppStore.data.receiving_user = res.data
      AppStore.emitChange()
    }
    console.log(res)
  })
}