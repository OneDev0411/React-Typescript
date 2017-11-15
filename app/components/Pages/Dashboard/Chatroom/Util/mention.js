import _ from 'underscore'

export default class Mention {
  /**
   * make mention blue
   */
  static highlight(text, mentions, members, me) {
    if (!mentions) {
      return text
    }

    let filterd_text = text
    const mentionsList = Mention.getList(members)

    // replacer
    let replacer = (text, user) => {
      const username = `@${user.username}`
      const replace =
        `<span style="background-color: rgb(255, 243, 184)">${username}</span>`

      return text.replace(new RegExp(username, 'g'), replace)
    }

    // search in mentions and highligh chat owner
    mentions.forEach(id => {
      const user = _.find(mentionsList, member => member.id.join('') === id)

      if (user && user.id.join('') === me.id) {
        filterd_text = replacer(filterd_text, user)
      }
    })

    // highlight @Room
    filterd_text = replacer(filterd_text, { username: 'Room' })

    return filterd_text
  }

  /**
   * extract mentions
   */
  static extractMentionsFromText(members, comment) {
    const mentions = comment.match(/\B@[A-Za-z0-9+_-]+/gi)
    const membersList = Mention.getList(members)
    let ids = []

    if (!mentions) {
      return []
    }

    mentions.forEach(username => {
      const user = _.find(membersList,
        member => `@${member.username.toLowerCase()}` === username.toLowerCase())

      if (!user) {
        return false
      }

      ids = ids.concat(user.id)
    })

    return _.uniq(ids)
  }

  /**
   * get mentions list
   */
  static getList(members, me = {}) {
    if (!members) {
      return []
    }

    const list = members
      .filter(user => user.id !== me.id)
      .map(user => {
        let username = user.username || user.abbreviated_display_name

        username = username.replace(/\+/g, '') // replace plus characters

        let atSignSplitter = username.split('@')

        if (atSignSplitter.length > 1) {
          username = atSignSplitter[0]
        }

        return {
          id: [user.id],
          avatar: user.profile_image_url,
          name: user.display_name,
          email: user.email,
          username
        }
      })

    list.unshift({
      id: _.pluck(members, 'id'),
      avatar: '/static/images/dashboard/rebot@2x.png',
      username: 'Room',
      name: 'Notify every member in this room'
    })

    return list
  }
}
