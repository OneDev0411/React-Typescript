module.exports = {
  url() {
    return `${this.api.launchUrl}/signin`
  },

  elements: {
    form: {
      selector: 'form[action="/signin"]'
    },

    email: {
      selector: '#username'
    },

    password: {
      selector: '#password'
    },

    submit: {
      selector:
        '#app > div > div:nth-child(1) > div > article > main > form > button'
    },

    accountDropdown: '.account-dropdown',
    accountDropdownMenu: '.account-dropdown .dropdown-menu',
    signOutLink: '.account-dropdown .dropdown-menu > :last-child',
    sideNav: '.sidebar__nav-list'
  },

  commands: [
    {
      login(email, password, wrong) {
        this.waitForElementVisible('@email').setValue('@email', email)
        this.waitForElementVisible('@password').setValue('@password', password)
        this.waitForElementVisible('@submit').click('@submit')

        if (wrong) {
          this.api.expect.element(this.elements.submit.selector).to.be.present
        } else {
          this.api.expect.element(this.elements.submit.selector).to.not.be
            .present
        }

        return this
      },

      loginScreenVisible(email, password) {
        this.api.pause(2000)

        let self = this

        this.api.elements('css selector', 'form[action="/signin"]', (
          element
        ) => {
          console.log(element)

          if (element.value.length) {
            console.log(element.value)
            self.login(email, password)
          }
        })
      },

      logout() {
        return this.click('@accountDropdown')
          .waitForElementVisible('@accountDropdownMenu')
          .click('@signOutLink')
      }
    }
  ]
}
