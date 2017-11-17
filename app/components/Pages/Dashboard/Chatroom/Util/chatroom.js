import { browserHistory } from 'react-router'
import { batchActions } from 'redux-batched-actions'
import _ from 'underscore'

import store from '../../../../../stores'
import ChatroomModel from '../../../../../models/Chatroom'
import ChatNotification from '../Services/notification'
import {
  getRooms,
  getMessages,
  addChatPopup,
  changeActiveRoom,
  removeRoom,
  removeRoomMessages,
  closeChatPopup
} from '../../../../../store_actions/chatroom'

export default class Chatroom {
  /**
   * synchronize chatroom with new data
   */
  static synchronize() {
    const { chatroom } = store.getState()
    const { popups, activeRoom } = chatroom

    // sync rooms
    store.dispatch(getRooms())

    // check are there any messages to sync or not
    if (_.size(chatroom.messages) === 0) {
      return false
    }

    // create a priority list for fetching
    const priorityList = Object.keys(popups || {})

    if (activeRoom) {
      priorityList.unshift(activeRoom)
    }

    // sort messages list based on
    const messages = _.sortBy(chatroom.messages,
      (list, roomId) => priorityList.indexOf(roomId))

    messages.forEach(async object => {
      const { list } = object
      const messagesKeys = Object.keys(list)
      const lastMessageKey = messagesKeys[messagesKeys.length - 1]
      const lastMessage = list && lastMessageKey ? list[lastMessageKey] : null

      if (!lastMessage) {
        return false
      }

      const roomId = lastMessage.room
      const created_at = lastMessage.created_at

      await store.dispatch(getMessages(roomId, 1000000, created_at, 'since'))
    })
  }

  /**
   * remove a specific room
   */
  static leaveRoom(userId, room) {
    // send request server to remove this room
    ChatroomModel.leaveRoom(userId, room)

    store.dispatch(batchActions([
      removeRoom(room.id),
      removeRoomMessages(room.id),
      closeChatPopup(room.id),
      changeActiveRoom(null)
    ]))
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
   * open chat popup
   */
  static openPopup(room, activate = true) {
    store.dispatch(addChatPopup(room))

    if (activate) {
      store.dispatch(changeActiveRoom(room))
      Chatroom.focusOnPopupInput(room)
    }
  }

  /**
   * check an specific popup is minimized or not
   */
  static isMinimized(room) {
    const popup = Chatroom.getPopupInstance(room)

    return popup ? popup.minimize : false
  }

  /**
   * set focus on specific popup
   */
  static focusOnPopupInput(room) {
    const el = document.getElementById(`CHAT_POPUP_${room}`)

    if (el) {
      el.getElementsByTagName('textarea')[0].focus()
    }
  }

  /**
   * open new chat
   */
  static openChat(room, activate = true) {
    if (activate) {
      ChatNotification.clear(room)
    }

    if (window && window.location.pathname.includes('/recents/')) {
      browserHistory.push(`/dashboard/recents/${room}?redirect=room`)
      store.dispatch(changeActiveRoom(room))
    } else {
      // open popup if not minimized (if activate=true open it anyway)
      if (!Chatroom.isMinimized(room) || activate) {
        Chatroom.openPopup(room, activate)
      }
    }
  }
}
