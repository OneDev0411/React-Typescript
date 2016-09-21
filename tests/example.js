module.exports = {
  'Homepage' : function (client) {
    const index = client.page.index()
    index.navigate()

    client
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'Rechat')
      .end();
  },

  'Rooms' : function(client) {
    const index = client.page.index()
    index.navigate()
    index.goToLogin()

    const login = client.page.login()
    login.login('emil@rechat.com', 'aaaaaa')

    const sidebar = client.page.sidebar()
    sidebar.goToRooms()

    const rooms = client.page.rooms()
    rooms.createRoom()

    rooms.say((new Date()).toString())

    rooms.goto(1)
    rooms.deleteRoom()

    client.end()
  }
}