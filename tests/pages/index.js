module.exports = {
  url: function() {
    return this.api.launchUrl
  },

  elements: {
    loginButton: {
      selector: 'a[href="/signin"]'
    },

    emailInput: {
      selector: '.nav input[type=text]'
    },

    registerButton: {
      selector: '.nav button'
    }
  },

  commands: [
    {
      goToLogin: function() {
        return this.waitForElementVisible('@loginButton', 1000)
          .click('@loginButton')
          .waitForElementNotPresent('@loginButton', 1000)
          .waitForElementPresent('form[action="/signin"]', 1000)
      }
    }
  ]
}
