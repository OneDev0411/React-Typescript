import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import EmailCompose from 'components/EmailCompose'
import ActionButton from 'components/Button/ActionButton'

import SocialDrawer from '../../components/SocialDrawer'
import hasMarketingAccess from '../../helpers/has-marketing-access'
import { convertRecipientsToEmails } from '../../helpers/convert-recipients-to-emails'

class ShareInstance extends React.Component {
  state = {
    isComposeDrawerOpen: false,
    isSocialDrawerOpen: false
  }

  static getDerivedStateFromProps(props, state) {
    const medium = props.instance && props.instance.template.medium

    if (props.isTriggered && medium === 'Email' && !state.isComposeDrawerOpen) {
      return {
        isComposeDrawerOpen: true
      }
    }

    if (props.isTriggered && medium !== 'Email' && !state.isSocialDrawerOpen) {
      return {
        isSocialDrawerOpen: true
      }
    }

    // For Closing Compose Drawer after selecting a contact
    if (!props.isTriggered && state.isComposeDrawerOpen) {
      return {
        isComposeDrawerOpen: false
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
    this.setState(
      state => ({
        isComposeDrawerOpen: !state.isComposeDrawerOpen
      }),
      this.props.handleTrigger
    )

  closeSocialDrawer = () =>
    this.setState({ isSocialDrawerOpen: false }, this.props.handleTrigger)

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
      this.setState(
        {
          isSendingEmail: false,
          isComposeDrawerOpen: false
        },
        this.props.handleTrigger
      )
    }
  }

  activeFlow = () => {
    const { instance } = this.props

    if (instance && instance.template.medium === 'Email') {
      this.setState({ isComposeDrawerOpen: true })
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

        {state.isComposeDrawerOpen && (
          <EmailCompose
            isOpen
            from={props.user}
            onClose={this.toggleComposeEmail}
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
