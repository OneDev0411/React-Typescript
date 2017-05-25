import _ from 'underscore'
import Chatroom from '../../models/Chatroom'
import types from '../../constants/chatroom'

function getMessages (id, messages) {
  return {
    type: types.GET_MESSAGES,
    id,
    messages
  }
}

export default function (id, limit, max_value) {
  return async (dispatch) => {
    const response = await Chatroom.getMessages(id, limit, max_value)
    const messages = _.indexBy(response.body.data.reverse(), 'id')
    dispatch(getMessages(id, messages))
  }
}
