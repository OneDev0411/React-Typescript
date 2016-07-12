// actions/users/listing-inquiry.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user, list_agent, listing) => {
  const params = {
    access_token: user.access_token,
    agent: list_agent.id,
    listing
  }
  User.listingInquiry(params, (err, res) => {
    // Success
    if (res.status === 'success') {
      console.log(res.data)
      console.log(res.data)
    }
    AppStore.emitChange()
  })
}