import _ from 'underscore'
import moment from 'moment'
import config from '../../config/public'
import Fetch from '../services/fetch'

const Chatroom = {}

/**
* returns rooms list
*/
Chatroom.getRooms = async function(user = {}) {
  const { access_token } = user

  try {
    const fetchRooms = new Fetch()
      .get('/rooms?limit=1000&sorting_value=Update')

    // required on ssr
    if (access_token)
      fetchRooms.set({ Authorization: `Bearer ${access_token}` })

    return await fetchRooms
  } catch (e) {}
}

Chatroom.getMessages = async function(id, limit = 20, max_value = null) {
  let endpoint = `/rooms/${id}/messages?limit=${limit}&sorting_value=Creation`

  if (max_value)
    endpoint += `&max_value=${max_value}`

  try {
    const response = await new Fetch().get(endpoint)
    return await response
  } catch (e) {}
}

export default Chatroom
