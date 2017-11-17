import user from '../data/login'
import CHAT_DATA from '../data/chat'

module.exports = {
  before(client) {
    console.log('Setting up...')
    client.resizeWindow(1200, 900)

    const loginToWebsite = client.page.login()

    loginToWebsite.navigate()
    loginToWebsite.login(
      client.globals.rechat_username,
      client.globals.rechat_password
    )
  },

  after(client) {
    client.end()
    console.log('Closing down...')
  },

  '#1 Toggle Chatbar': client => {
    const chat = client.page.chat()

    chat
      .openChatBar()
      .closeChatBar()
      .assert.hidden('@chatOverlay')
  },

  '#2 Toggle Instant mode': client => {
    const chat = client.page.chat()

    chat.openChatBar().click('@openFullScreenChatBtn')
    chat.api.pause(10000)
    chat.assert
      .visible('@chatRoomFullScreen')
      .click('@closeFullScreenChatBtn')
      .assert.hidden('@chatRoomFullScreen')
      .closeChatBar()
  },

  '#4 Open a popup': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .closePopup()
      .openFirstChatPopup()
      .assert.visible('@chatPopup')
      .leaveChatRoom()
  },

  '#5 Minimize a popup': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .click('@chatPopupMinimizeIcon')
      .assert.cssClassPresent('@chatPopup', 'minimize')
      .click('@chatPopupMinimizeIcon')
      .leaveChatRoom()
  },

  '#6 Maximize a popup': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .click('@chatPopupMaximizeIcon')
      .assert.visible('@chatRoomFullScreen')
      .click('@exitChatRoomFullScreen')
      .leaveChatRoom()
  },

  '#7 Close a popup': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .closePopup()
      .assert.elementNotPresent('@chatPopup')
      .openFirstChatPopup()
      .leaveChatRoom()
  },

  // '#8 Change active room when closing a popup' : function(client) {
  //   const chat = client.page.chat()
  //
  //   chat
  //     .createDirectRoom()
  //     .createGroupChatRoom()
  //     .assert.visible('@secondChatPopup')
  //     .assert.cssClassPresent('@secondChatPopupBar', 'isActive')
  //     .click('@secondChatPopupCloseIcon')
  //     .assert.cssClassPresent('@chatPopupBar', 'isActive')
  //     .leaveChatRoom()
  //     .openFirstChatPopup()
  //     .leaveChatRoom()
  // },

  '#9  Load messages': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .writeMessage()
      .assert.visible('@chatPopupMessageList')
      .leaveChatRoom()
  },

  '#10 Loading previous messages': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .waitForElementPresent('@firstMessage')
      .api.execute(
        'document.getElementsByClassName(\'messages-list\')[0].scrollTop = 0'
      )

    chat.api.pause(2000)
    chat.leaveChatRoom()
  },

  '#11 Create direct room': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .assert.visible('@chatPopup')
      .leaveChatRoom()
  },

  '#12 Create a group Room': client => {
    const chat = client.page.chat()

    chat
      .createGroupChatRoom()
      .assert.visible('@chatPopup')
      .leaveChatRoom()
  },

  '#13 Restrict Adding New Member to Direct Room': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .click('@chatPopupMemberIcon')
      .assert.elementNotPresent('@addMemberAutocomplete')
      .closeModal()
      .leaveChatRoom()
  },

  '#14 Add new members to a group room': client => {
    const chat = client.page.chat()

    chat
      .createGroupChatRoom()
      .click('@chatPopupMemberIcon')
      .setValue('@addMemberSearch', CHAT_DATA.member4)
      .waitForElementVisible('@firstOptionAddMember')
      .click('@firstOptionAddMember')
      .click('@submitBtnAddMemberModal')
      .waitForElementNotPresent('@addMemberModal')
      .api.pause(1000)

    chat.assert.containsText('@chatPopupMemberCount', '4').leaveChatRoom()
  },

  '#15 Leave a room': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .leaveChatRoom()
      .assert.elementNotPresent('@chatPopup')
  },

  // '#16 Room notifications': function(client) {
  //   const chat = client.page.chat()
  //   const login = client.page.login()
  //
  //   login
  //     .logout()
  //     .navigate()
  //     .login(user.secondaryEmail, user.secondaryPassword)
  //
  //   chat
  //     .createDirectRoom(user.email)
  //     .writeMessage()
  //     .closePopup()
  //
  //   login
  //     .logout()
  //     .navigate()
  //     .login(client.globals.rechat_username, client.globals.rechat_password)
  //
  //   client.pause(5000)
  //
  //   chat
  //     .assert.containsText('@chatIconBadge', '1')
  //     .openChatBar()
  //     .assert.containsText('@firstChatBadge', '1')
  // },

  '#17 Reset room notifications': client => {
    const chat = client.page.chat()

    chat.createDirectRoom()
    chat
      .openFirstChatPopup()
      .assert.elementNotPresent('@chatIconBadge')
      .assert.elementNotPresent('@firstChatBadge')
      .leaveChatRoom()
  },

  '#18 Delivery notification': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .writeMessage()
      .waitForElementVisible('@lastMessageReport', 250000)
      .click('@lastMessageReport')
      .api.pause(200)

    chat
      .waitForElementVisible('@deliveryReportPopover')
      .assert.containsText(
        '@deliveryReportPopoverName',
        CHAT_DATA.member1Name
      )
      .closePopup()
  },

  '#19 Room acknowledge': client => {
    const chat = client.page.chat()
    const login = client.page.login()

    login
      .logout()
      .navigate()
      .login(user.secondaryEmail, user.secondaryPassword)

    chat.openFirstChatPopup().closePopup()

    login
      .logout()
      .navigate()
      .login(client.globals.rechat_username, client.globals.rechat_password)

    chat
      .openFirstChatPopup()
      .waitForElementVisible('@lastMessageReport')
      .assert.cssClassPresent('@lastMessageReport', 'blue')
      .leaveChatRoom()
  },

  '#20 User is typing and typing ended':
    `${
      function () {
      // cannot automate, bcz cannot login two accounts at once
      }}`,

  '#21 Auto open popup on receive new message':
    `${
      function () {
      // cannot automate, bcz cannot login two accounts at once
      }}`,

  '#22 Upload attachment':
    `${
      client => {
        const chat = client.page.chat()

        chat
          .createGroupChatRoom()
          .attachImage()
          .assert.visible('@chatPopupAttachment')
          .leaveChatRoom()
      }}`,

  '#23 Upload attachment through drag and drop':
    `${
      function () {
      // cannot be automated, No way to control outside browser. drag and drop
      }}`,

  '#24 Upload attachment via clipboard':
    `${
      function () {
      // cannot be automated, No way to control outside browser
      }}`,

  '#25  User status':
    `${
      function () {
      // cannot automate, bcz cannot login two account at once
      }}`,

  '#26 Mentions': client => {
    const chat = client.page.chat()

    chat
      .createGroupChatRoom()
      .setValue('@chatPopupInput', '@')
      .waitForElementVisible('@chatPopupMentions')
      .api.keys(client.Keys.ESCAPE)

    chat.assert
      .elementNotPresent('@chatPopupMentions')
      .api.keys(client.Keys.BACK_SPACE)

    chat
      .setValue('@chatPopupInput', '@')
      .waitForElementVisible('@chatPopupMentions')
      .api.keys(client.Keys.ARROW_DOWN)

    chat.assert
      .cssClassPresent('@chatPopupSecondMention', 'selected')
      .api.keys(client.Keys.ARROW_UP)

    chat.assert
      .cssClassPresent('@chatPopupFirstMention', 'selected')
      .api.keys(client.Keys.ENTER)

    chat.assert.valueContains('@chatPopupInput', '@Room').leaveChatRoom()
  },

  '#27 File viewer':
    `${
      client => {
        const chat = client.page.chat()

        chat
          .createGroupChatRoom()
          .attachImage()
          .click('@chatPopupAttachmentImage')
          .assert.visible('@imageViewer')
          .click('@imageViewerClose')
          .api.pause(200)

        chat.leaveChatRoom()
      }}`,

  '#28  Listing/Alert viewer': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .waitForElementPresent('@listingIcon')
      .click('@listingIcon')
      .assert.visible('@listingSearch')
      .leaveChatRoom()
  },

  '#29 Search in room list': client => {
    const chat = client.page.chat()

    chat
      .createDirectRoom()
      .closePopup()
      .createGroupChatRoom()
      .openChatBar()
      .setValue('@chatBarSearch', CHAT_DATA.testSearch)
      .api.elements(
        'css selector',
        '.bm-menu-wrap .list-container .list .item',
        (result) => {
          client.assert.equal(
            result.value.length,
            1,
            'Incorrect number of elements in filter'
          )

          chat
            .closeChatBar()
            .leaveChatRoom()
            .openFirstChatPopup()
            .leaveChatRoom()
        }
      )
  },

  '#3 Fullscreen chatroom': client => {
    const chat = client.page.chat()

    client
      .url(`${chat.api.launch_url}/dashboard/recents`)
      .waitForElementVisible('body')

    chat.assert.visible('@recentScreenChatRoom')
  }
}
