import ROOMS_DATA from '../data/rooms'

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
      selector: '#room-dropdown'
    },

    delete_dialog: {
      selector: '.modal-dialog'
    },

    delete_confirm: {
      selector: '.modal-dialog .btn-danger'
    },

    first_room_name: {
      selector: 'div.dashboard__chat-rooms .room-list__item__names'
    },

    newNameField: {
      selector: '#react-select-3--value > div.Select-input > input'
    },
    newMessageHeading: {
      selector: '.dashboard__messages > div > div:nth-child(1) > h3'
    },

    newRoomCreateBtn: {
      selector: '#app > div > main > div > div > button'
    },

    newMessageButton: {
      selector: '.dashboard__chat-rooms button'
    },

    roomSharedTitle: {
      selector: '.dashboard__messages > div:nth-child(1) > div > ul > li:last-child > div'
    },

    messageDeliveryCheck: {
      selector: '.dashboard__messages div.message-item:last-child > div.pull-left > span > span > span > i:nth-child(2)'
    },

    profileBtn: {
      selector: 'div.no-user-select > div:nth-child(1)'
    },

    addMembers: {
      selector: 'div.no-user-select > div:nth-child(2) > div:nth-child(3)'
    },

    modalAddMemberField: {
      selector: '#react-select-3--value > div.Select-input > input'
    },

    modalAddBtn: {
      selector: 'div.modal-footer > button.btn.btn-primary'
    },

    membersCount: {
      selector: 'div.no-user-select > div:nth-child(1) > span'
    },

    closeMembersListingMenu: {
      selector: 'div.no-user-select > div:nth-child(2) > div:nth-child(1) > a'
    },

    membersListInMenu: {
      selector: 'div.dashboard__messages.pull-left > div:nth-child(1) > div:nth-child(2) > h3'
    },

    leaveChat: {
      selector: 'div.dropdown-menu--room-settings > div > ul > li:nth-child(2)'
    },

    groupTitle: {
      selector: 'h3.room-list__item__names'
    }
  },

  commands: [
    {
      createRoom() {
        try {
          const self = this

          this.getText('@first_room_name', result => {
            if (result.value === '+15202249639') {
              self.deleteRoom()
            } else {
              console.log(result.value)
            }
          })
        } catch (err) {
          console.log('Room not found')
        }

        this.waitForElementVisible('@room_list')
          .click('@new_room')
          .click('@recipients_arrow')

        // React select is not easily testable. Hack found on https://github.com/JedWatson/react-select/issues/603
        this.setValue('.Select-input input', ' ')
        this.waitForElementVisible('.Select-option')
        this.click('.Select-option')

        return this
      },

      deleteRooms(listOfRooms) {
        const self = this

        this.waitForElementVisible('@first_room_name')
        listOfRooms.forEach(room => {
          this.getText('@first_room_name', (result) => {
            if (result.value === room) {
              self.deleteRoom()
            } else {
              console.log(result.value)
            }
          })
        })
      },

      deleteAllRooms() {
        this.api.pause(3000)

        const self = this

        this.api.elements('css selector', '.room-list__item', (element) => {
          console.log(element)
          element.value.forEach(elementId => {
            self.api.elementIdClick(element.ELEMENT)
            self.deleteRoom()
          })
        })
      },

      createFirstRoom(roomName) {
        this.waitForElementVisible('@newRoomCreateBtn')
          .click('@newRoomCreateBtn')
        // Click on down arrow to bring the suggestions
        this.waitForElementVisible('@newMessageHeading')
          .click('@recipients_arrow')
          .setValue('.Select-input input', roomName)
        this.api.keys([this.api.Keys.ENTER])
      },

      clickCreateNewMessage() {
        this.waitForElementVisible('@newMessageButton')
          .click('@newMessageButton')
      },

      createMultipleRooms(rooms) {
        this.waitForElementVisible('@room_list')
          .click('@new_room')
        this.waitForElementVisible('@newMessageHeading')
          .click('@recipients_arrow')
        rooms.forEach(room => {
          this.setValue('.Select-input input', room)
          this.api.keys([this.api.Keys.ENTER])

          // Click on Message box
          this.waitForElementVisible('@message_box')
            .click('@message_box')
        })
      },

      createNewRoom(roomName) {
        this.waitForElementVisible('@room_list')
          .click('@new_room')
        this.waitForElementVisible('@newMessageHeading')
          .click('@recipients_arrow')
          .setValue('.Select-input input', roomName)
        this.api.keys([this.api.Keys.ENTER])
      },

      say(message, verifyDelivery) {
        // Enter text in the message box
        this.waitForElementVisible('@message_box')
          .click('@message_box')
          .setValue('@message_box', message)

        this.api.keys([this.api.Keys.ENTER])

        this.waitForElementVisible('.modal-open', ROOMS_DATA.defaultWaitTime)
        this.waitForElementNotPresent('.modal-open', ROOMS_DATA.defaultWaitTime)

        this.click('@message_box')
          .setValue('@message_box', message)

        this.api.keys([this.api.Keys.ENTER])

        this.api.refresh()

        this.waitForElementVisible('@first_room_name')
          .click('@first_room_name')

        this.waitForElementVisible('@message_box', ROOMS_DATA.defaultWaitTime)
        this.click('@message_box')
          .setValue('@message_box', message)

        this.api.keys([this.api.Keys.ENTER])

        // Wait until message is shown in the room
        this.waitForElementVisible('div.fade-in')

        if (verifyDelivery) {
          this.verifyPhoneShared()
        }

        return this
      },

      goto(index) {
        this.waitForElementVisible('@newMessageButton')
        this.click(`.dashboard__chat-rooms ul li:nth-child(${  index  })`)
      },

      deleteRoom() {
        // Click on more options from top right corner
        this.waitForElementVisible('@more')
          .click('@more')
          .click('ul[aria-labelledby="room-dropdown"]>li:last-child')

        this.api.expect.element(this.elements.delete_dialog.selector).to.be.visible
        this.api.expect.element(this.elements.delete_confirm.selector).to.be.visible

        this.click('@delete_confirm')

        // Delete dialog should be gone
        this.api.expect.element('@delete_dialog').to.be.not.present
      },

      verifyListingShared(searchItem) {
      // Select first room
        this.goto(1)
        this.api.expect.element(this.elements.roomSharedTitle.selector).text.to.contain(ROOMS_DATA.homeSharedTitle)
      },

      verifyPhoneShared() {
        // Select first room
        this.goto(1)
        this.waitForElementPresent('@messageDeliveryCheck', ROOMS_DATA.deliveryTimeout)
        this.api.expect.element(this.elements.messageDeliveryCheck.selector).to.be.present
      },

      addMemberByPhoneToGroup(phoneNumber) {
        let initialMembersCount = 0

        this.getText('@membersCount', (result) => {
          initialMembersCount = result.value
        })
        this.waitForElementVisible('@profileBtn')
          .click('@profileBtn')
        this.waitForElementVisible('@addMembers')
          .click('@addMembers')

        // Enter phone number to add a member
        this.waitForElementVisible('@recipients_arrow')
          .click('@recipients_arrow')
          .setValue('.Select-input input', phoneNumber)

        this.api.keys([this.api.Keys.ENTER])

        // Clicking on drop down option as ENTER key isn't working
        this.waitForElementVisible('.Select-option')
          .click('.Select-option')
        this.waitForElementVisible('@modalAddBtn')
          .click('@modalAddBtn')
        this.waitForElementNotPresent('@modalAddBtn')
        this.waitForElementVisible('@closeMembersListingMenu')
          .click('@closeMembersListingMenu')

        // Refreshing so that new member is displayed in the header
        this.api.refresh()

        this.waitForElementVisible('@membersCount')

        const self = this

        this.getText('@membersCount', (result) => {
          self.assert.ok(result.value[0] > initialMembersCount)
        })

        this.getText('@membersListInMenu', (result) => {
          found = false
          result.value.split(',').forEach(elem => {
            if (phoneNumber === elem.trim()) {
              found = true
            }
          })
          self.assert.ok(found === true)
        })
      },

      leaveGroupChat() {
        let nameBeforeDeletion = ''
        let nameAfterDeletion = ''

        this.waitForElementVisible('@groupTitle')
        this.getText('@groupTitle', (result) => {
          nameBeforeDeletion = result.value
        })
        this.deleteRoom()
        this.waitForElementVisible('@groupTitle')

        const self = this

        this.getText('@groupTitle', (result) => {
          nameAfterDeletion = result.value
          self.assert.ok(result.value !== nameBeforeDeletion)
        })
      }
    }
  ]
}
