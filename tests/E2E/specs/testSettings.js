module.exports = {
  before(client) {
    console.log('Setting up...')

    // Login to the website
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

  '#49 Settings drop down Should Be Visible': client => {
    const search = client.page.search()
    const index = client.page.index()

    search.navigate()
    search.isPageReady()

    search.api.refresh()

    search.closeHomeListing()
    index.openSettings()
  },

  '#50 User profile box should appear': client => {
    const index = client.page.index()

    index.updateUserProfile()
  },

  '#51 Change First Name': client => {
    const index = client.page.index()
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    index.openSettings()
    index.updateFirstName()
    index.openSettings()
    index.verifyUpdatedFirstName()
  },

  '#52 Change Last Name': client => {
    const index = client.page.index()
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    index.openSettings()
    index.updateLastName()
    index.openSettings()
    index.verifyUpdatedLastName()
  },

  '#53 Change Email address': client => {
    const index = client.page.index()
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    index.openSettings()
    index.updateEmail()
    index.openSettings()
    index.verifyUpdatedEmail()
  },

  '#54 User should be log out': client => {
    const index = client.page.index()
    const search = client.page.search()

    search.navigate()
    search.isPageReady()

    index.openSettings()
    index.verifyUserLogsOut()
  }
}
