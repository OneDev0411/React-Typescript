import types from '../../constants/chatroom'

export default function createMessage (id, message, queueId) {
  return {
    type: types.CREATE_MESSAGE,
    append: true,
    increaseTotal: true,
    id,
    messages: message,
    queueId
  }
}
