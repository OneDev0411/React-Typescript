import moment from 'moment'
import emojify from 'emojify.js'
import linkifyString from 'linkifyjs/string'
import store from '../../../../../stores'
import {
  createMessage,
  updateMessage
} from '../../../../../store_actions/chatroom'
import Mention from './mention'

emojify.setConfig({
  img_dir: '/static/images/emoji'
})

export default class Message {
  /**
   * send new message
   */
  static send(roomId, message, author = {}) {
    return new Promise(resolve => {
      // create temp message
      const { qid, tempMessage } = Message.createTemporaryMessage(
        roomId,
        message,
        author
      )

      // create temporary message
      Message.create(roomId, tempMessage)

      // resolve
      resolve(tempMessage)

      // post message to socket
      Message.postMessage(roomId, message, qid)
    })
  }

  /**
   * post message via socket
   */
  static postMessage(roomId, message, qid) {
    window.socket.emit('Message.Send', roomId, message, (err, message) => {
      if (err) {
        return reject(err)
      }

      Message.create(roomId, message, qid)
    })
  }

  /**
   * post task message via socket
   */
  static postTaskComment(task, comment) {
    return new Promise((resolve, reject) => {
      window.socket.emit(
        'Task.Message.Send',
        task.id,
        comment,
        (err, comment) => {
          if (err) {
            return reject(err)
          }

          Message.create(task.room.id, comment)
          resolve()
        }
      )
    })
  }

  /**
   * create temporary message
   */
  static createTemporaryMessage(roomId, message, author = {}) {
    const unixtime = moment().unix()
    const qid = `queued_${unixtime}`

    const { abbreviated_display_name } = author

    const tempMessage = {
      ...message,
      ...{
        id: qid,
        room: roomId,
        author: {
          abbreviated_display_name,
          ...author
        },
        queued: true,
        created_at: unixtime,
        updated_at: unixtime
      }
    }

    return {
      qid,
      tempMessage
    }
  }

  /**
   * create new message and store
   */
  static create(roomId, message, queueId = null) {
    store.dispatch(createMessage(roomId, { [message.id]: message }, queueId))
  }

  /**
   * update message
   */
  static update(roomId, message) {
    store.dispatch(updateMessage(roomId, message))
  }

  /**
   * get message text
   */
  static getText(message, members, user) {
    let text = message.comment

    if (message.comment) {
      text = emojify.replace(linkifyString(message.comment))
      text = Mention.highlight(text, message.mentions, members, user)
      text = Message.nl2br(text)
    }

    return text
  }

  /**
   * convert new line to break line
   */
  static nl2br(str, is_xhtml = false) {
    const breakTag =
      is_xhtml || typeof is_xhtml === 'undefined' ? '<br />' : '<br>'

    return `${str}`.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`)
  }

  /**
   * check message is alert and then return the alert object
   */
  static isAlert(message) {
    const { notification } = message

    if (
      notification &&
      notification.objects &&
      notification.object_class === 'Alert'
    ) {
      return notification.objects[0]
    }

    return false
  }

  /**
   * get message author
   */
  static getAuthor(message) {
    if (!message) {
      return null
    }

    if (message.author) {
      return message.author
    }

    const alert = Message.isAlert(message)

    if (alert) {
      return alert.created_by
    }

    // test for listing without message
    if (
      message.notification &&
      message.notification.subjects &&
      message.notification.subjects[0].type === 'user'
    ) {
      return message.notification.subjects[0]
    }

    return {
      profile_image_url: '/static/images/dashboard/rebot@2x.png',
      display_name: 'Notify every member in this room'
    }
  }

  /**
   * get message date
   */
  static getYMD(message) {
    if (!message) {
      return null
    }

    return moment.unix(message.created_at).format('YMMD')
  }

  /**
   * get message date
   */
  static getDate(message, format = '') {
    return moment.unix(message.created_at).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: format,
      sameElse: format
    })
  }
}
