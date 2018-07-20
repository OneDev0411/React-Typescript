import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import SearchListingDrawer from '../../../../../../views/components/SearchListingDrawer'

import Compose from '../../../../../../views/components/EmailCompose'

import InstantMarketing from '../../../../../../views/components/InstantMarketing'

import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import { getContactAttribute } from '../../../../../../models/contacts/helpers/get-contact-attribute'

import { selectContact } from '../../../../../../reducers/contacts/list'

import { sendContactsEmail } from '../../../../../../models/email-compose/send-contacts-email'

class ShareListing extends React.Component {
  state = {
    listing: null,
    isListingsModalOpen: false,
    isInstantMarketingBuilderOpen: false,
    isComposeEmailOpen: false,
    isSendingEmail: false,
    htmlTemplate: ''
  }

  get Recipients() {
    return this.props.selectedContacts
      .map(id => {
        const contact = selectContact(this.props.contacts, id)

        if (!contact.summary.email) {
          return null
        }

        const emails = getContactAttribute(
          contact,
          selectDefinitionByName(this.props.attributeDefs, 'email')
        )

        return {
          contactId: contact.id,
          name: contact.summary.display_name,
          avatar: contact.summary.profile_image_url,
          email: contact.summary.email,
          emails: emails.map(email => email.text)
        }
      })
      .filter(recipient => recipient !== null)
  }

  handleSendEmails = async values => {
    this.setState({
      isSendingEmail: true
    })

    const emails = values.recipients.map(recipient => ({
      to: recipient.email,
      subject: values.subject,
      html: this.state.htmlTemplate,
      contact: recipient.contactId
    }))

    try {
      await sendContactsEmail(emails)

      this.props.notify({
        status: 'success',
        message: `${emails.length} emails has been sent to your contacts`
      })
    } catch (e) {
      console.log(e)
      // todo
    } finally {
      this.setState({
        isSendingEmail: false,
        isComposeEmailOpen: false
      })
    }
  }

  toggleListingModal = () =>
    this.setState(state => ({
      isListingsModalOpen: !state.isListingsModalOpen
    }))

  toggleInstantMarketingBuilder = () =>
    this.setState(state => ({
      isInstantMarketingBuilderOpen: !state.isInstantMarketingBuilderOpen
    }))

  toggleComposeEmail = () =>
    this.setState(state => ({
      isComposeEmailOpen: !state.isComposeEmailOpen
    }))

  onSelectListing = async listing =>
    this.setState({
      listing,
      isListingsModalOpen: false,
      isInstantMarketingBuilderOpen: true
    })

  handleSaveMarketingCard = async template => {
    this.toggleInstantMarketingBuilder()

    this.setState({
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: false,
      htmlTemplate: `<!DOCTYPE html>${template}</html>`
    })
  }

  render() {
    const { listing } = this.state

    return (
      <Fragment>
        <div className="list--secondary-button">
          <button
            className="button c-button--shadow"
            onClick={this.toggleListingModal}
          >
            Marketing Center
          </button>
        </div>

        <SearchListingDrawer
          isOpen={this.state.isListingsModalOpen}
          compact={false}
          title="Select a Listing"
          onClose={this.toggleListingModal}
          onSelectListing={this.onSelectListing}
        />

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.toggleInstantMarketingBuilder}
          handleSave={this.handleSaveMarketingCard}
          templateData={{ listing }}
          assets={listing && listing.gallery_image_urls}
        />

        <Compose
          isOpen={this.state.isComposeEmailOpen}
          onClose={this.toggleComposeEmail}
          recipients={this.Recipients}
          html={this.state.htmlTemplate}
          onClickSend={this.handleSendEmails}
          isSubmitting={this.state.isSendingEmail}
        />
      </Fragment>
    )
  }
}

function mapStateToProps({ contacts }) {
  return { contacts: contacts.list, attributeDefs: contacts.attributeDefs }
}

export default connect(
  mapStateToProps,
  { notify }
)(ShareListing)
