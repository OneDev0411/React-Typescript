module.exports = {
  elements: {
    sidebar: {
      selector: 'aside'
    },

    rooms: {
      selector: 'aside a[href="/dashboard/recents"]'
    }
  },

  commands: [
    {
      goToRooms() {
        return this.waitForElementVisible('@sidebar')
          .click('@rooms')
      }
    }
  ]
};
