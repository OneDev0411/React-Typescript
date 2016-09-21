module.exports = {
  elements: {
    room_list: {
      selector: '.dashboard__chat-rooms'
    },

    new_room: {
      selector: '.dashboard__chat-rooms button'
    },

    room_dialog: {
      selector: '.dashboard__messages'
    },

    recipients: {
      selector: '.Select-placeholder'
    },

    recipients_arrow: {
      selector: '.Select-arrow-zone'
    },

    message_box: {
      selector: '.chat-message-input'
    },

    message_board: {
      selector: '.touch-scroll'
    },

    more: {
      selector: "#room-dropdown",
    },

    delete_dialog: {
      selector: '.modal-dialog'
    },

    delete_confirm: {
      selector: '.modal-dialog .btn-danger'
    }
  },

  commands: [
    {
      createRoom() {
        this.waitForElementVisible('@room_list', 1000)
          .click('@new_room')
          .click('@recipients_arrow')

        // React select is not easily testable. Hack found on https://github.com/JedWatson/react-select/issues/603
        this.setValue('.Select-input input', ' ')
        this.click('.Select-option')

        return this
      },

      say(message) {
        this.click('@message_box')
          .setValue('@message_box', message)

        this.api.keys([this.api.Keys.ENTER])

        this.waitForElementVisible('div.fade-in', 1000)

        return this
      },

      goto(index) {
        this.click('.dashboard__chat-rooms ul li:nth-child(' + index + ')')
      },

      deleteRoom() {
        this.waitForElementVisible('@more', 1000)
          .click('@more')
          .click('ul[aria-labelledby="room-dropdown"]>li:last-child')

        this.api.expect('@delete_dialog').to.be.visible
        this.api.expect('@delete_confirm').to.be.visible

        this.click('@delete_confirm')

        this.api.expect('@delete_dialog').to.be.not.present
      }
    }
  ]
};
