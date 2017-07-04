// actions/search.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user, q) => {
  const params = {
    access_token: user.access_token,
    q
  }
  User.search(params, (err, response) => {
    // Success
    // if (response.status === 'success')
      // console.log(response)

    AppStore.emitChange()
  })
}
