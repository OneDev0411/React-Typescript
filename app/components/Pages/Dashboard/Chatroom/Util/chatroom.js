import { browserHistory } from 'react-router'
import _ from 'underscore'
import store from '../../../../../stores'
import NotificationService from '../../../../../services/notification'
import {
  addChatPopup,
  changeActiveRoom
} from '../../../../../store_actions/chatroom'

export default class Chatroom {
  constructor() {
  }

  /**
   * get all popup instances
   */
  static getPopups() {
    const { popups } = store.getState().chatroom
    return popups
  }

  /**
   * get popup by id
   */
  static getPopupInstance(room) {
    const popups = Chatroom.getPopups()
    return popups ? popups[room] : null
  }

  /**
   * check an specific popup is minimized or not
   */
  static isMinimized(room) {
    const popup = Chatroom.getPopupInstance(room)
    return popup ? popup.minimize : false
  }

  /**
   * open new chat
   */
  static openChat(room, activate = true) {

    if (activate) {
      NotificationService.clear(room)
    }

    if (window && window.location.pathname.includes('/recents/')) {
      browserHistory.push(`/dashboard/recents/${room}?redirect=room`)
      store.dispatch(changeActiveRoom(room))
    }
    else {
      // open popup if not minimized (if activate=true open it anyway)
      if (!Chatroom.isMinimized(room) || activate) {
        store.dispatch(addChatPopup(room, activate))
      }
    }
  }
}
