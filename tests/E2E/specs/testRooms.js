import ROOMS_DATA from '../data/rooms'

module.exports = {
  before(client) {
    const index = client.page.index()

    index.navigate()
    index.goToLogin()

    const login = client.page.login()

    login.login(client.globals.rechat_username, client.globals.rechat_password)
  },

  after(client) {
    client.end()
  },

  //  '#18 Create a new Chatroom with Phone number' : function(client) {
  //    const sidebar = client.page.sidebar()
  //    sidebar.goToRooms()
  //
  //    const rooms = client.page.rooms()
  //    rooms.deleteAllRooms()
  //    rooms.createFirstRoom(ROOMS_DATA.room4)
  //
  //    rooms.say((new Date()).toString(), true)  // Verify delivery of message
  //
  //    rooms.goto(1)
  //    rooms.deleteRoom()
  //
  //  },

  '#48 User can create Room, send message and delete the created room': client => {
    const sidebar = client.page.sidebar()

    sidebar.goToRooms()

    const rooms = client.page.rooms()

    rooms.deleteAllRooms()
    rooms.createFirstRoom(ROOMS_DATA.room4)

    rooms.say(new Date().toString(), true) // Verify delivery of message

    rooms.goto(1)
    rooms.deleteRoom()
  },

  '#47 Multiple Rooms should be created': client => {
    const sidebar = client.page.sidebar()

    sidebar.goToRooms()

    const rooms = client.page.rooms()

    // Delete if rooms already exists
    rooms.deleteAllRooms()

    rooms.createFirstRoom(ROOMS_DATA.room1)
    rooms.say(new Date().toString())
    rooms.goto(1)
    rooms.deleteAllRooms()

    rooms.createFirstRoom(ROOMS_DATA.room2)
    rooms.say(new Date().toString())
    rooms.goto(1)
    rooms.deleteAllRooms()

    rooms.createFirstRoom(ROOMS_DATA.room3)
    rooms.say(new Date().toString())
    rooms.goto(1)
    rooms.deleteAllRooms()
  },

  '#85 Create a new Chat room with Email Address': client => {
    const sidebar = client.page.sidebar()

    sidebar.goToRooms()

    const rooms = client.page.rooms()

    // Delete room if already exists
    rooms.deleteAllRooms()

    rooms.createFirstRoom(ROOMS_DATA.email1)
    rooms.say(new Date().toString(), true)
    rooms.goto(1)
    rooms.deleteAllRooms()
  },

  '#88 Leave the group chat': client => {
    const search = client.page.search()
    const rooms = client.page.rooms()
    const sidebar = client.page.sidebar()

    search.navigate()
    search.isPageReady()
    sidebar.goToRooms()

    //    rooms.clickCreateNewMessage()
    //    rooms.createMultipleRooms([ROOMS_DATA.room1, ROOMS_DATA.room2,
    //                               ROOMS_DATA.room3, ROOMS_DATA.room5])
    //    rooms.say((new Date()).toString())

    rooms.leaveGroupChat()
  }
}
