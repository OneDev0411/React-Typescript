module.exports = {
  url() {
    return `${this.api.launchUrl}/signup`
  },

  elements: {
    emailFormField: {
      selector: '.c-auth__field__input'
    },

    signUpBtn: {
      selector: '.c-auth__submit-btn'
    },

    signUpConfirmation: {
      selector: '.c-auth__submit-alert--success > b'
    },

    errorNotification: {
      selector: '.c-auth__field__error-alert'
    }
  },

  commands: [
    {
      signup: (email, wrong) => {
        this.waitForElementVisible('@emailFormField').setValue(
          '@emailFormField',
          email
        )
        this.waitForElementVisible('@signUpBtn').click('@signUpBtn')
        this.api.pause(500)

        if (wrong) {
          this.api.expect.element(this.elements.errorNotification.selector).to
            .be.present
        } else {
          this.api.expect
            .element(this.elements.signUpConfirmation.selector)
            .text.to.be.equal(email)
        }

        return this
      }
    }
  ]
}
