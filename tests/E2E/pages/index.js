import LANDING_DATA from '../data/home'

module.exports = {
  url() {
    return this.api.launchUrl
  },

  elements: {
    loginButton: {
      selector: 'a[href="/signin"]'
    },

    loading: {
      selector: '#loading>div'
    },

    emailInput: {
      selector: '.nav input[type=text]'
    },

    registerButton: {
      selector: '.nav button'
    },

    settingsBtn: {
      selector: '#account-dropdown'
    },

    settingsLink: {
      selector: 'ul.sidebar__account > li > ul > li:nth-child(2) > a'
    },
    phoneNumberField: {
      selector: 'form > div.modal-body > div.col-xs-9 > div:nth-child(4) > div > input'
    },
    save: {
      selector: 'form > div.modal-footer > div > button.btn.btn-primary'
    },
    accountSettingsBox: {
      selector: 'body > div:nth-child(15) > div > div.fade.in.modal > div'
    },
    firstName: {
      selector: 'form > div.modal-body > div.col-xs-9 > div:nth-child(1) > input'
    },
    lastName: {
      selector: 'form > div.modal-body > div.col-xs-9 > div:nth-child(2) > input'
    },
    email: {
      selector: 'form > div.modal-body > div.col-xs-9 > div:nth-child(3) > input'
    },
    phoneNumber: {
      selector: 'form > div.modal-body > div.col-xs-9 > div:nth-child(4) > div > input'
    },
    cancel: {
      selector: 'form > div.modal-footer > div > button.btn.btn-link'
    },
    signOut: {
      //      selector: 'ul.account-dropdown > li > ul > li:nth-child(5) > a'
      //      selector: 'li.account-dropdown > ul > li:nth-child(5) > a'
      selector: 'li.account-dropdown a[href="/signout"]'
    },
    signIn: {
      selector: 'header > nav > div > div > ul > li:nth-child(1) > a'
    },
    needHelp: {
      //      selector: '#app > div > main > aside > div:nth-child(2) > ul > div:nth-child(1)'
      selector: 'ul.sidebar__account > li:nth-child(2) > a > div'
    },
    conversationBox: {
      selector: '#intercom-container > div > span > div'
    },

    closeConversationBoxBtn: {
      selector: '#app > div > main > aside > div:nth-child(3)'
    },
    clusterMarker: {
      selector: '.cluster-marker'
    },

    clusterMarkerDiv: {
      selector: '.cluster-marker div'
    }
  },

  commands: [
    {
      verifyClusters() {
        this.api.expect.element(this.elements.clusterMarker.selector).to.be.present
      },

      verifyClusterZoom() {
        this.waitForElementVisible('@clusterMarker')

        let initialValue = 0

        this.getText('@clusterMarkerDiv', (result) => {
          console.log(result.value)
          initialValue = result.value
        })
        this.click('@clusterMarker')
        this.isPageReady()
        this.api.expect.element(this.elements.clusterMarker.selector).to.be.present

        let self = this

        this.api.elements('css selector', '.cluster-marker', (element) => {
          element.value.forEach(elementId => {
            self.api.elementIdText(elementId.ELEMENT, item => {
              self.assert.ok(parseInt(item.value, 10) <= parseInt(initialValue, 10))
            })
          })
        })
      },

      isPageReady() {
        this.waitForElementNotPresent('@loading', 15000) // Wait for loading to complete
      },

      goToLogin() {
        return this.waitForElementVisible('@loginButton')
          .click('@loginButton')
          .waitForElementNotPresent('@loginButton')
          .waitForElementPresent('form[action="/signin"]')
      },

      openSettings() {
        this.waitForElementVisible('@settingsBtn')
          .click('@settingsBtn')
      },

      updateUserProfile() {
        this.click('@settingsLink')
        this.click('@phoneNumberField')
          .setValue('@phoneNumberField', LANDING_DATA.phoneNumber)
        this.click('@save')
        this.api.expect.element('@accountSettingsBox').not.to.be.present
      },

      updateFirstName() {
        this.click('@settingsLink')
        this.click('@firstName')
          .clearValue('@firstName')
          .setValue('@firstName', LANDING_DATA.firstName)
        this.click('@save')
        this.api.expect.element('@accountSettingsBox').not.to.be.present
      },

      verifyUpdatedFirstName() {
        this.waitForElementVisible('@settingsLink')
          .click('@settingsLink')
        this.waitForElementVisible('@firstName')
          .click('@firstName')
        this.api.expect.element(this.elements.firstName.selector).to.have.value.that.equals(LANDING_DATA.firstName)
        this.click('@cancel')
      },

      updateLastName() {
        //        this.click('@settingsLink')
        this.click('ul.sidebar__account > li > ul > li:nth-child(1) > a')
        this.click('@lastName')
          .clearValue('@lastName')
          .setValue('@lastName', LANDING_DATA.lastName)
        this.click('@save')
        this.api.expect.element('@accountSettingsBox').not.to.be.present
      },

      verifyUpdatedLastName() {
        //        this.click('@settingsLink')
        this.click('ul.sidebar__account > li > ul > li:nth-child(1) > a')
        this.click('@lastName')
        this.api.expect.element(this.elements.lastName.selector).to.have.value.that.equals(LANDING_DATA.lastName)
        this.click('@cancel')
      },

      updateEmail() {
        //        this.click('@settingsLink')
        this.click('ul.sidebar__account > li > ul > li:nth-child(1) > a')
        this.click('@email')
          .clearValue('@email')
          .setValue('@email', LANDING_DATA.email)
        this.click('@save')
        this.api.expect.element('@accountSettingsBox').not.to.be.present
      },

      verifyUpdatedEmail() {
        //        this.click('@settingsLink')
        this.click('ul.sidebar__account > li > ul > li:nth-child(1) > a')
        this.click('@email')
        this.api.expect.element(this.elements.email.selector).to.have.value.that.equals(LANDING_DATA.email)
        this.click('@cancel')
      },

      verifyUserLogsOut() {
        this.waitForElementVisible('@signOut')
          .click('@signOut')
        this.waitForElementVisible('@signIn')
        this.api.expect.element(this.elements.signIn.selector).text.to.be.equal(LANDING_DATA.loginText)
      },

      hoverOnNeedHelp() {
        let self = this

        this.waitForElementVisible('@needHelp')
        this.api.moveToElement(this.elements.needHelp.selector, 1, 5, () => {
          self.api.expect.element(self.elements.needHelp.selector).to.have.attribute('aria-describedby')
        })
      },

      conversationBoxOpens() {
        this.waitForElementVisible('@needHelp')
          .click('@needHelp')
        this.waitForElementVisible('@conversationBox')
        this.api.expect.element(this.elements.conversationBox.selector).to.be.visible
      },

      closeConversationBox() {
        this.waitForElementVisible('@conversationBox')
        this.click('.intercom-header-buttons-close-visible')
        //        this.waitForElementNotPresent('#intercom-container > div > span > div > div.intercom-booting-header > div > div > div')
        this.api.expect.element('#intercom-container > div > span > div > div.intercom-booting-header > div > div').to.be.not.present
      }
    }
  ]
}
