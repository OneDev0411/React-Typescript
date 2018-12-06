import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import InstantMarketing from 'components/InstantMarketing'
import ActionButton from 'components/Button/ActionButton'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'

import EmailCompose from 'components/EmailCompose'
import { SearchContactDrawer } from 'components/SearchContactDrawer'

import { getContact } from 'models/contacts/get-contact'

import { getTemplatePreviewImage } from 'components/InstantMarketing/helpers/get-template-preview-image'

import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import { selectDefinitionByName } from '../../../../../reducers/contacts/attributeDefs'

class SendContactCard extends React.Component {
  state = {
    isFetchingContact: false,
    contact: this.props.contact,
    isInstantMarketingBuilderOpen: false,
    isComposeEmailOpen: false,
    isSearchDrawerOpen: false,
    owner: this.props.user
  }

  static getDerivedStateFromProps(props, state) {
    // For Opening Search Drawer
    if (
      props.isTriggered &&
      !state.isSearchDrawerOpen &&
      !state.isInstantMarketingBuilderOpen
    ) {
      return {
        isSearchDrawerOpen: true
      }
    }

    // For just closing search drawer through its close CTA
    if (!props.isTriggered && state.isSearchDrawerOpen) {
      return {
        isSearchDrawerOpen: false
      }
    }

    // For Closing Search Drawer after selecting a contact
    if (
      !props.isTriggered &&
      state.isSearchDrawerOpen &&
      state.isInstantMarketingBuilderOpen
    ) {
      return {
        isSearchDrawerOpen: false
      }
    }

    return state
  }

  showMarketingBuilder = async () => {
    if (this.state.contact) {
      this.toggleInstantMarketingBuilder()

      return false
    }

    this.setState({
      isFetchingContact: true
    })

    try {
      const response = await getContact(this.props.contactId)

      this.setState({
        contact: response.data,
        isFetchingContact: false,
        isInstantMarketingBuilderOpen: true
      })
    } catch (e) {
      this.setState({
        isFetchingContact: false
      })
    }
  }

  toggleInstantMarketingBuilder = () =>
    this.setState(state => ({
      isInstantMarketingBuilderOpen: !state.isInstantMarketingBuilderOpen
    }))

  toggleComposeEmail = () =>
    this.setState(state => ({
      isComposeEmailOpen: !state.isComposeEmailOpen
    }))

  closeSearchDrawer = () =>
    this.setState({ isSearchDrawerOpen: false }, this.props.handleTrigger)

  handleSelectedContact = contact =>
    this.setState(
      {
        contact,
        isSearchDrawerOpen: false
      },
      () => {
        this.props.handleTrigger()
        this.toggleInstantMarketingBuilder()
      }
    )

  handleSaveMarketingCard = async (template, owner) => {
    this.toggleInstantMarketingBuilder()
    this.generatePreviewImage(template)

    this.setState({
      owner,
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: true,
      htmlTemplate: template.result,
      templateScreenshot: null
    })
  }

  generatePreviewImage = async template =>
    this.setState({
      templateScreenshot: await getTemplatePreviewImage(template, {})
    })

  handleSendEmails = async values => {
    this.setState({
      isSendingEmail: true
    })

    const recipient = values.recipients[0]

    const emails = [
      {
        to: recipient.email,
        subject: values.subject,
        html: this.state.htmlTemplate,
        contact: recipient.contactId
      }
    ]

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
        isComposeEmailOpen: false,
        isInstantMarketingBuilderOpen: false
      })
    }
  }

  get Recipients() {
    const { contact } = this.state

    if (!contact) {
      return []
    }

    const emails = getContactAttribute(
      contact,
      selectDefinitionByName(this.props.attributeDefs, 'email')
    )

    return [
      {
        contactId: contact.id,
        name: contact.summary.display_name,
        avatar: contact.summary.profile_image_url,
        email: contact.summary.email,
        emails: emails.map(email => email.text),
        readOnly: true
      }
    ]
  }

  render() {
    if (hasMarketingAccess(this.props.user) === false) {
      return null
    }

    return (
      <Fragment>
        {this.props.contact || this.props.contactId ? (
          <ActionButton
            appearance="outline"
            onClick={this.showMarketingBuilder}
            disabled={this.state.isFetchingContact}
            {...this.props.buttonStyle}
          >
            {this.props.children}
          </ActionButton>
        ) : (
          <SearchContactDrawer
            title="Select a Contact"
            isOpen={this.state.isSearchDrawerOpen}
            onSelect={this.handleSelectedContact}
            onClose={this.closeSearchDrawer}
          />
        )}

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.toggleInstantMarketingBuilder}
          handleSave={this.handleSaveMarketingCard}
          templateData={{ user: this.props.user, contact: this.state.contact }}
          templateTypes={['Birthday']}
          defaultTemplate={this.props.selectedTemplate}
        />

        {this.state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            from={this.state.owner}
            onClose={this.toggleComposeEmail}
            recipients={this.Recipients}
            html={this.state.templateScreenshot}
            onClickSend={this.handleSendEmails}
            isSubmitting={this.state.isSendingEmail}
            disableAddNewRecipient
          />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  return {
    user,
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(
  mapStateToProps,
  { notify }
)(SendContactCard)
