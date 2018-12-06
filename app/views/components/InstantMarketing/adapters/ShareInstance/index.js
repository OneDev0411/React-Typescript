import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'
import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import EmailCompose from 'components/EmailCompose'
import ActionButton from 'components/Button/ActionButton'
import { SearchContactDrawer } from 'components/SearchContactDrawer'

import SocialDrawer from '../../components/SocialDrawer'
import hasMarketingAccess from '../../helpers/has-marketing-access'
import { convertRecipientsToEmails } from '../../helpers/convert-recipients-to-emails'

class ShareInstance extends React.Component {
  state = {
    contacts: [],
    isComposeEmailOpen: false,
    isSearchContactDrawerOpen: false,
    isSocialDrawerOpen: false
  }

  static getDerivedStateFromProps(props, state) {
    const medium = props.instance && props.instance.template.medium

    if (
      props.isTriggered &&
      medium === 'Email' &&
      !state.isSearchContactDrawerOpen
    ) {
      return {
        isSearchContactDrawerOpen: true
      }
    }

    if (props.isTriggered && medium === 'Social' && !state.isSocialDrawerOpen) {
      return {
        isSocialDrawerOpen: true
      }
    }

    // For Closing Search Contact Drawer after selecting a contact
    if (!props.isTriggered && state.isSearchContactDrawerOpen) {
      return {
        isSearchContactDrawerOpen: false
      }
    }

    // For Closing Social Drawer
    if (!props.isTriggered && state.isSocialDrawerOpen) {
      return {
        isSocialDrawerOpen: false
      }
    }

    return state
  }

  toggleComposeEmail = () =>
    this.setState(state => ({
      isComposeEmailOpen: !state.isComposeEmailOpen
    }))

  closeSearchDrawer = () =>
    this.setState(
      { isSearchContactDrawerOpen: false },
      this.props.handleTrigger
    )

  closeSocialDrawer = () =>
    this.setState({ isSocialDrawerOpen: false }, this.props.handleTrigger)

  handleSelectedContact = contact =>
    this.setState(
      {
        contacts: [contact],
        isSearchContactDrawerOpen: false
      },
      () => {
        this.props.handleTrigger()
        this.toggleComposeEmail()
      }
    )

  get Recipients() {
    return this.state.contacts
      .map(contact => {
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

    const emails = convertRecipientsToEmails(
      values.recipients,
      values.subject,
      this.props.instance.html
    )

    try {
      await sendContactsEmail(emails)

      // reset form
      if (form) {
        form.reset()
      }

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

  activeFlow = () => {
    if (
      this.props.instance &&
      this.props.instance.template.medium === 'Email'
    ) {
      this.setState({ isSearchContactDrawerOpen: true })
    } else {
      this.setState({ isSocialDrawerOpen: true })
    }
  }

  render() {
    const { props, state } = this

    if (hasMarketingAccess(props.user) === false) {
      return null
    }

    return (
      <Fragment>
        {!props.hasExternalTrigger && (
          <ActionButton
            appearance="outline"
            onClick={this.activeFlow}
            {...props.buttonStyle}
          >
            {props.children}
          </ActionButton>
        )}

        {state.isSearchContactDrawerOpen && (
          <SearchContactDrawer
            title="Select a Contact"
            isOpen={state.isSearchContactDrawerOpen}
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
          />
        )}

        {state.isSocialDrawerOpen && (
          <SocialDrawer
            instance={props.instance}
            onClose={this.closeSocialDrawer}
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
