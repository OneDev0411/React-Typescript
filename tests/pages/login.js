module.exports = {
  url: function() {
    return this.api.launchUrl + '/signin'
  },

  elements: {
    form: {
      selector: 'form[action="/signin"]'
    },

    email: {
      selector: 'form[action="/signin"] input[type=text]'
    },

    password: {
      selector: 'form[action="/signin"] input[type=password]'
    },

    submit: {
      selector: 'form[action="/signin"] button[type=submit]'
    }
  },

  commands: [
    {
      login: function(email, password) {
        this.waitForElementVisible('@email').setValue('@email', email)
        this.waitForElementVisible('@password').setValue('@password', password)
        this.waitForElementVisible('@submit').click('@submit')
        return this
      }
    }
  ]
};
