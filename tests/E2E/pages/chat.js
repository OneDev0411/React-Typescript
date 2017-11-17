import path from 'path'
import CHAT_DATA from '../data/chat.js'

module.exports = {
  url() {
    return `${this.api.launchUrl}/dashboard/mls`
  },

  elements: {
    chatOverlay: '.bm-overlay',
    chatIcon: '.chatroom-icon',
    listingIcon: '.nav-stacked',
    chatBar: '.bm-menu-wrap',
    chatBarSearch: '.bm-menu-wrap input[type="text"]',
    recentScreenChatRoom: 'main .chatroom',
    openFullScreenChatBtn: '.bm-menu-wrap .toggle-sidebar svg',
    closeFullScreenChatBtn: '.chatroom-fullscreen .toggle-sidebar',
    chatRoomFullScreen: '.chatroom-fullscreen',
    exitChatRoomFullScreen: '.chatroom-fullscreen .exit-fullscreen',
    createNewMessage: '.bm-menu-wrap .new-room',
    addMemberModal: '.chatroom-add-member',
    addMemberSearch: '.chatroom-add-member input',
    addMemberAutocomplete: '.chatroom-add-member .compose',
    firstOptionAddMember: '.chatroom-add-member .suggestions > :first-child',
    firstMessage: '.chat-popup .messages-list > :first-child',
    lastMessageReport:
      '.chat-popup .messages-list > :last-child .delivery-report',
    submitBtnAddMemberModal: '.chatroom-add-member .modal-footer button',
    chatPopup: '.chat-popup',
    chatPopupBar: '.chat-popup .bar',
    secondChatPopup: '.chat-popup:nth-child(2)',
    secondChatPopupBar: '.chat-popup:nth-child(2) .bar',
    chatPopupDropdownBtn: '.chat-popup .dropdown',
    chatPopupDropdownMenu: '.chat-popup .dropdown .dropdown-menu',
    leaveChatRoomLink: '.chat-popup .dropdown .dropdown-menu > :first-child',
    chatPopupLeave: '.leave-icon svg',
    chatPopupMinimizeIcon: '.chat-popup .minimize',
    chatPopupMaximizeIcon: '.chat-popup .maximize',
    chatPopupCloseIcon: '.chat-popup .close-icon',
    chatPopupMemberIcon: '.chat-popup .members',
    chatPopupMemberCount: '.chat-popup .members .bdg',
    secondChatPopupCloseIcon: '.chat-popup:nth-child(2) .close-icon',
    firstChat: '.bm-menu-wrap .list-container .list > :first-child',
    modalBackdrop: '.modal-backdrop',
    chatPopupMessageList: '.chat-popup .messages-list',
    chatPopupUpload: '.chat-popup .message-create .upload input[type="file"]',
    chatPopupAttachment: '.chat-popup .messages-list .attachment',
    chatPopupAttachmentImage: '.chat-popup .messages-list .attachment img',
    imageViewer: '.container_a31snl',
    imageViewerClose: '.container_a31snl .close_1pts9jo',
    chatPopupInput: '.chat-popup textarea',
    chatPopupMentions: '.chat-popup .suggestions',
    chatPopupFirstMention: '.chat-popup .suggestions .items .item:first-child',
    chatPopupSecondMention:
      '.chat-popup .suggestions .items .item:nth-child(2)',
    deliveryReportPopover: '#popover-delivery-report',
    deliveryReportPopoverName: '#popover-delivery-report .name',
    chatIconBadge: '.chatroom-icon .count',
    firstChatBadge:
      '.bm-menu-wrap .list-container .list > :first-child .notifications .count',
    listingSearch: '.c-mls-toolbar__search-box__field__input',
    firstListing: '.listing-panel > :nth-child(2) div > :first-child',
    listingShareButton: '.listing-viewer .listing-viewer--navbar button',
    listingShareChatRoomSelect: '.create-item__user-select',
    listingShareChatRoomSelectDropdown: '.Select-menu-outer',
    listingShareChatRoomSelectFirstOption: '.Select-menu > :first-child',
    listingShareSubmit: '.modal-800 .modal-footer button',
    listingShareModal: '.modal-800',
    listingViewerClose: '.listing-viewer .close',
    listingViewer: '.listing-viewer',
    lastListingMessage:
      '.chat-popup .messages-list > :last-child .content .listing'
  },

  commands: [
    {
      openChatBar() {
        this.waitForElementVisible('@chatIcon')
        this.api.pause(500)
        this.click('@chatIcon')
        this.api.pause(1500)

        return this
      },

      closeChatBar() {
        this.api.pause(5000)
        this.moveToElement('@chatOverlay', 331, 0).api.mouseButtonClick(0)
        // Ad pause for chatBar to close
        this.api.pause(1000)

        return this
      },

      createDirectRoom(member, selector) {
        this.openChatBar()
          .click('@createNewMessage')
          .waitForElementVisible('@addMemberModal')
          .setValue('@addMemberSearch', member || CHAT_DATA.member1)
          .waitForElementVisible('@firstOptionAddMember')
          .click('@firstOptionAddMember')
          .click('@submitBtnAddMemberModal')
          .api.pause(1000)

        this.waitForElementVisible(selector || '@chatPopup')
          .waitForElementNotPresent('@modalBackdrop')
          .api.pause(500)

        return this
      },

      leaveChatRoom() {
        this.click('@chatPopupMemberIcon').api.pause(500)

        return this.click('@chatPopupLeave')
      },

      writeMessage() {
        this.setValue('@chatPopupInput', CHAT_DATA.message).api.keys(
          this.api.Keys.ENTER
        )

        return this.waitForElementVisible('@chatPopupMessageList')
      },

      closePopup() {
        return this.click('@chatPopupCloseIcon')
      },

      openFirstChatPopup() {
        this.openChatBar()
          .waitForElementVisible('@firstChat')
          .click('@firstChat')
          .api.pause(500)

        return this.waitForElementVisible('@chatPopup')
      },

      createGroupChatRoom() {
        this.openChatBar()
          .click('@createNewMessage')
          .waitForElementVisible('@addMemberModal')
          .setValue('@addMemberSearch', CHAT_DATA.member2)
          .waitForElementVisible('@firstOptionAddMember')
          .click('@firstOptionAddMember')
          .setValue('@addMemberSearch', CHAT_DATA.member3)
          .api.pause(500)

        this.waitForElementVisible('@firstOptionAddMember')
          .click('@firstOptionAddMember')
          .click('@submitBtnAddMemberModal')
          .api.pause(1000)

        return this.waitForElementVisible(
          '@chatPopup'
        ).waitForElementNotPresent('@modalBackdrop')
      },

      closeModal() {
        this.moveToElement('@modalBackdrop', 0, 0).api.mouseButtonClick(0)
        this.api.pause(200)

        return this
      },

      attachImage() {
        return this.setValue(
          '@chatPopupUpload',
          path.resolve(__dirname, '../uploads/waterfall.jpg')
        ).waitForElementVisible('@chatPopupAttachment', 50000)
      }
    }
  ]
}
