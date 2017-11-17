import SEARCH_DATA from '../data/search'

module.exports = {
  elements: {
    sidebar: {
      selector: '#app > div > div:nth-child(1) > aside > div > svg'
    },

    emailShared: {
      selector:
        'div.bm-menu-wrap > div > nav > div > div.list-container > div > div > div.title.vcenter.col-sm-9.col-xs-9 > span'
    }
  },

  commands: [
    {
      goToRooms(usePhone) {
        this.waitForElementVisible('@sidebar').click('@sidebar')

        if (usePhone) {
          this.api.expect
            .element(this.elements.emailShared.selector)
            .text.to.equal(SEARCH_DATA.searchSharePhone)
        } else {
          this.api.expect
            .element(this.elements.emailShared.selector)
            .text.to.equal(SEARCH_DATA.searchShareEmailName)
        }
      }
    }
  ]
}
