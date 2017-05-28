import _ from 'underscore'
import Chatroom from '../../models/Chatroom'
import types from '../../constants/chatroom'

function getMessages (id, messages, { total }) {
  return {
    type: types.GET_MESSAGES,
    id,
    messages,
    info: { total }
  }
}

export default function (id, limit, max_value) {
  return async (dispatch) => {
    const response = await Chatroom.getMessages(id, limit, max_value)
    const { info, data } = response.body
    const messages = _.indexBy(data.reverse(), 'id')
    dispatch(getMessages(id, messages, info))
  }
}
