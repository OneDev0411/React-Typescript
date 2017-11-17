import CONTACTS_DATA from '../data/contacts'

module.exports = {
  url() {
    return `${this.api.launchUrl}/dashboard/contacts`
  },

  elements: {
    contactsIcon: {
      selector: 'aside ul li.contacts'
    },

    contactListing: {
      selector: 'div.contacts'
    },

    firstContact: {
      selector: 'table > tbody > tr:nth-child(2) > td:nth-child(1) > div'
    },

    contactDetailScreen: {
      selector: '.card.details'
    },

    enterNote: {
      selector: 'div.right-pane > div.note > textarea'
    },

    submitNote: {
      selector: 'div.note > div.footer > button'
    },

    firstNoteInListing: {
      selector:
        '#tabs-pane-notes > div > div:nth-child(1) > div > div.text > div'
    },

    notesTabActive: {
      selector: '.nav.nav-tabs .active #tabs-tab-notes > div > span.name'
    },

    addContact: {
      selector: 'div.cta > div > button'
    },

    modalAddContact: {
      selector: '.modal-add-contact'
    },

    modalFirstName: {
      selector: 'div.modal-body > div.fullname > input:nth-child(1)'
    },
    modalLastName: {
      selector: 'div.modal-body > div.fullname > input:nth-child(2)'
    },
    modalEmail: {
      selector: 'div.modal-body > div:nth-child(4) > div > input'
    },
    modalSubmitContact: {
      selector: 'div.modal-footer > button'
    }
  },

  commands: [
    {
      verifyContactMenuButton() {
        this.waitForElementVisible('@contactListing')
        this.api.expect.element(this.elements.contactListing.selector).to.be
          .present

        return this
      },

      verifyContactDetail() {
        this.waitForElementVisible('@firstContact').click('@firstContact')
        this.waitForElementVisible('@contactDetailScreen')
        this.api.expect.element(this.elements.contactDetailScreen.selector).to
          .be.present
      },

      verifyNotesAddition() {
        this.waitForElementVisible('@enterNote')
          .click('@enterNote')
          .setValue('@enterNote', CONTACTS_DATA.testNote)
        this.click('@submitNote')
        this.waitForElementVisible('@notesTabActive', 5000)
        this.api.pause(5000)
        this.api.expect
          .element(this.elements.firstNoteInListing.selector)
          .text.to.equal(CONTACTS_DATA.testNote)
      },

      createNewContact() {
        this.waitForElementVisible('@addContact').click('@addContact')
        this.waitForElementVisible('@modalAddContact')

        this.clearValue('@modalFirstName').setValue(
          '@modalFirstName',
          CONTACTS_DATA.firstName
        )
        this.clearValue('@modalLastName').setValue(
          '@modalLastName',
          CONTACTS_DATA.lastName
        )
        this.clearValue('@modalEmail').setValue(
          '@modalEmail',
          CONTACTS_DATA.email
        )

        this.click('@modalSubmitContact')

        this.api.expect.element('@modalSubmitContact').not.to.be.present
      }
    }
  ]
}
