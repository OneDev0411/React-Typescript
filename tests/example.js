module.exports = {
  'Homepage' : function (client) {
    const index = client.page.index()
    index.navigate()

    client
      .waitForElementVisible('body')
      .assert.containsText('body', 'Rechat')
      .end();
  },

  'Search' : function(client) {
    const search = client.page.search()
    search.navigate()
    search.ready()
    search.openFilters()
    search.toggleSold()   // Enable Sold
    search.toggleActive() // Disable Active
    search.update()
    search.closeFilters()
    search.allMarkersShouldBe('red')
    search.zoomIn()
    search.allMarkersShouldBe('red')
    search.closeFilters()
    search.zip(75214)
    search.allMarkersShouldBe('red')
  },

  'Rooms' : function(client) {
    const index = client.page.index()
    index.navigate()
    index.goToLogin()

    const login = client.page.login()
    login.login(client.globals.rechat_username, client.globals.rechat_password)

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