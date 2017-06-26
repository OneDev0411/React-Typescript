import { browserHistory } from 'react-router'
import store from '../../../../../stores'
import NotificationService from '../../../../../services/notification'
import {
  addChatPopup,
  changeActiveRoom
} from '../../../../../store_actions/chatroom'

export default class Chatroom {
  constructor() {
  }

  static openChat(room) {
    NotificationService.clear(room)

    if (window && window.location.pathname.includes('/recents/')) {
      browserHistory.push(`/dashboard/recents/${room}?redirect=room`)
      store.dispatch(changeActiveRoom(room))
    }
    else
      store.dispatch(addChatPopup(room))
  }
}
