import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import SearchListingDrawer from '../../../../../../views/components/SearchListingDrawer'

import EmailCompose from '../../../../../../views/components/EmailCompose'

import InstantMarketing from '../../../../../../views/components/InstantMarketing'

import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import { getContactAttribute } from '../../../../../../models/contacts/helpers/get-contact-attribute'

import { selectContact } from '../../../../../../reducers/contacts/list'

import { sendContactsEmail } from '../../../../../../models/email-compose/send-contacts-email'

import { getTemplateScreenshot } from '../../../../../../models/instant-marketing'

import { confirmation } from '../../../../../../store_actions/confirmation'
import ActionButton from 'components/Button/ActionButton'
import { getActiveTeamACL } from 'utils/user-teams'

class ShareListing extends React.Component {
  state = {
    listing: null,
    isListingsModalOpen: false,
    isInstantMarketingBuilderOpen: false,
    isComposeEmailOpen: false,
    isSendingEmail: false,
    htmlTemplate: '',
    templateScreenshot: null
  }

  get Recipients() {
    return this.props.selectedRows
      .map(id => {
        const contact = selectContact(this.props.contacts, id)

        if (!contact || !contact.summary.email) {
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

  handleSendEmails = async (values, form) => {
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

      // reset form
      form.reset()

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
        isComposeEmailOpen: false,
        isInstantMarketingBuilderOpen: false
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

  requestClose = () =>
    this.props.confirmation({
      message: 'Don’t want to market?',
      description: 'By canceling you will lose any changes you have made.',
      cancelLabel: 'No, don’t cancel',
      confirmLabel: 'Yes, cancel',
      onConfirm: this.closeMarketing
    })

  onSelectListing = async listing =>
    this.setState({
      listing,
      isListingsModalOpen: false,
      isInstantMarketingBuilderOpen: true
    })

  handleSaveMarketingCard = async template => {
    this.toggleInstantMarketingBuilder()
    this.generatePreviewImage(template)

    this.setState({
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: true,
      htmlTemplate: template.result,
      templateScreenshot: null
    })
  }

  generatePreviewImage = async template => {
    const imageUrl = await getTemplateScreenshot(
      template.result,
      [template.width, template.height],
      {
        width: template.width,
        height: template.height
      }
    )

    this.setState({
      templateScreenshot: `<img style="width: calc(100% - 2em); margin: 1em;" src="${imageUrl}" />`
    })
  }

  closeMarketing = () =>
    this.setState({
      isInstantMarketingBuilderOpen: false,
      isComposeEmailOpen: false
    })

  render() {
    const { listing } = this.state
    const { user } = this.props
    const acl = getActiveTeamACL(user)
    const hasMarketingPermission = acl.includes('Marketing')

    if (!hasMarketingPermission) {
      return null
    }

    return (
      <Fragment>
        <ActionButton
          onClick={this.toggleListingModal}
          style={{ padding: '0.70em 1.5em' }}
          inverse
        >
          Marketing Center
        </ActionButton>

        <SearchListingDrawer
          isOpen={this.state.isListingsModalOpen}
          compact={false}
          title="Select a Listing"
          onClose={this.toggleListingModal}
          onSelectListing={this.onSelectListing}
        />

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.requestClose}
          handleSave={this.handleSaveMarketingCard}
          templateData={{ listing, user }}
          assets={listing && listing.gallery_image_urls}
        />

        <EmailCompose
          isOpen={this.state.isComposeEmailOpen}
          onClose={this.toggleComposeEmail}
          recipients={this.Recipients}
          html={this.state.templateScreenshot}
          onClickSend={this.handleSendEmails}
          isSubmitting={this.state.isSendingEmail}
        />
      </Fragment>
    )
  }
}

function mapStateToProps({ contacts, user }) {
  return {
    contacts: contacts.list,
    attributeDefs: contacts.attributeDefs,
    user
  }
}

export default connect(
  mapStateToProps,
  { notify, confirmation }
)(ShareListing)
