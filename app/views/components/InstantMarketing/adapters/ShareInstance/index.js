import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'
import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import EmailCompose from 'components/EmailCompose'
import ActionButton from 'components/Button/ActionButton'
import { SearchContactDrawer } from 'components/SearchContactDrawer'

import hasMarketingAccess from '../../helpers/has-marketing-access'

class ShareInstance extends React.Component {
  state = {
    isFetchingContact: false,
    contact: this.props.contact,
    isComposeEmailOpen: false,
    isSearchDrawerOpen: false
  }

  static getDerivedStateFromProps(props, state) {
    // For Opening Search Drawer
    if (props.isTriggered && !state.isSearchDrawerOpen) {
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
    if (!props.isTriggered && state.isSearchDrawerOpen) {
      return {
        isSearchDrawerOpen: false
      }
    }

    return state
  }

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
        isSearchDrawerOpen: false,
        isComposeEmailOpen: true
      },
      () => {
        this.props.handleTrigger()
      }
    )

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
        isComposeEmailOpen: false
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
    const { props, state } = this

    if (hasMarketingAccess(props.user) === false) {
      return null
    }

    return (
      <Fragment>
        {props.contact ? (
          <ActionButton
            appearance="outline"
            onClick={this.showMarketingBuilder}
            disabled={state.isFetchingContact}
            {...props.buttonStyle}
          >
            {props.children}
          </ActionButton>
        ) : (
          <SearchContactDrawer
            title="Select a Contact"
            isOpen={state.isSearchDrawerOpen}
            onSelect={this.handleSelectedContact}
            onClose={this.closeSearchDrawer}
          />
        )}

        {state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            from={props.user}
            onClose={this.toggleComposeEmail}
            recipients={this.Recipients}
            html={props.instance.html}
            onClickSend={this.handleSendEmails}
            isSubmitting={state.isSendingEmail}
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
)(ShareInstance)
