import HOME_DATA from '../data/home'

module.exports = {
  before(client) {
    const index = client.page.index()

    index.navigate()
    index.goToLogin()

    const login = client.page.login()

    login.navigate()
    login.login(client.globals.rechat_username, client.globals.rechat_password)
  },

  after(client) {
    client.end()
  },

  '#44 Need help Tool tip is displayed on hover': client => {
    const index = client.page.index()

    index.hoverOnNeedHelp()
  },

  '#45 On clicking Need Help Chat box opens': client => {
    const index = client.page.index()

    index.conversationBoxOpens()
  },

  '#84 HomePage for ReChat is opening': client => {
    const index = client.page.index()

    index.navigate()

    client.waitForElementVisible('body').getTitle(title => {
      this.assert.equal(title, HOME_DATA.reChat)
    })
  },

  '#89 Clusters show on map in blue circle': client => {
    const index = client.page.index()

    index.navigate()

    index.verifyClusters()
  },

  '#91 Cluster number should change on zoom': client => {
    const index = client.page.index()

    index.navigate()

    index.verifyClusterZoom()
  }
}
