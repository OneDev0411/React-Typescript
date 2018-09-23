import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import InstantMarketing from 'components/InstantMarketing'
import ActionButton from 'components/Button/ActionButton'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import { selectDefinitionByName } from '../../../../../reducers/contacts/attributeDefs'
import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'

import { getTemplateScreenshot } from 'models/instant-marketing'

import Compose from 'components/EmailCompose'
import { getActiveTeamACL } from 'utils/user-teams'

import { getContact } from 'models/contacts/get-contact'

class SendContactCard extends React.Component {
  state = {
    isFetchingContact: false,
    contact: this.props.contact,
    isInstantMarketingBuilderOpen: false,
    isComposeEmailOpen: false
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

  handleSaveMarketingCard = async template => {
    this.toggleInstantMarketingBuilder()
    this.generatePreviewImage(template)

    this.setState({
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: false,
      htmlTemplate: template.result,
      templateScreenshot: null
    })
  }

  generatePreviewImage = async template => {
    const imageUrl = await getTemplateScreenshot(
      template.result,
      [template.width, template.height],
      {
        width: template.width / 2,
        height: template.height / 2
      }
    )

    this.setState({
      templateScreenshot: `<img style="width: calc(100% - 2em); margin: 1em;" src="${imageUrl}" />`
    })
  }

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

  get HasMarketingAccess() {
    const { user } = this.props
    const acl = getActiveTeamACL(user)

    return acl.includes('Marketing')
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
    if (!this.HasMarketingAccess) {
      return null
    }

    return (
      <Fragment>
        <ActionButton
          appearance="outline"
          onClick={this.showMarketingBuilder}
          disabled={this.state.isFetchingContact}
          {...this.props.buttonStyle}
        >
          {this.props.children}
        </ActionButton>

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.toggleInstantMarketingBuilder}
          handleSave={this.handleSaveMarketingCard}
          templateData={{ user: this.props.user, contact: this.state.contact }}
          templateTypes={['Contact']}
        />

        <Compose
          isOpen={this.state.isComposeEmailOpen}
          onClose={this.toggleComposeEmail}
          recipients={this.Recipients}
          html={this.state.templateScreenshot}
          onClickSend={this.handleSendEmails}
          isSubmitting={this.state.isSendingEmail}
          disableAddNewRecipient
        />
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
