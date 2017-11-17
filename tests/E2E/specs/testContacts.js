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

  beforeEach(client) {
    const contacts = client.page.contacts()
    const loginToWebsite = client.page.login()

    loginToWebsite.navigate()

    client.url(result => {
      if (result.value.search('signin') !== -1) {
        loginToWebsite.login(
          client.globals.rechat_username,
          client.globals.rechat_password
        )
      }
    })
  },

  after(client) {
    client.end()
    console.log('Closing down...')
  },

  '#83 User can click on contact icon to view contact listing': client => {
    const contacts = client.page.contacts()

    contacts.navigate()
    contacts.verifyContactMenuButton()
  },

  '#82 User can see detail of a contact': client => {
    const contacts = client.page.contacts()
    const search = client.page.search()

    contacts.navigate()
    contacts.verifyContactDetail()
  },

  '#31 Add a Note to a Contact': client => {
    const contacts = client.page.contacts()
    const search = client.page.search()

    contacts.navigate()
    contacts.verifyContactDetail()
    contacts.verifyNotesAddition()
  },

  '#90 Create a New Contact': client => {
    const contacts = client.page.contacts()
    const search = client.page.search()

    contacts.navigate()

    contacts.createNewContact()
  }
}
