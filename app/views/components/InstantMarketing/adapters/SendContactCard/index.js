import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import idx from 'idx'

import { normalizeContact } from 'models/email-compose/helpers/normalize-contact'
import { getTemplateInstances } from 'models/instant-marketing/get-template-instances'

import InstantMarketing from 'components/InstantMarketing'
import ActionButton from 'components/Button/ActionButton'

import { confirmation } from 'actions/confirmation'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import EmailCompose from 'components/EmailCompose'
import { SearchContactDrawer } from 'components/SearchContactDrawer'

import { getContact } from 'models/contacts/get-contact'

import getTemplateInstancePreviewImage from 'components/InstantMarketing/helpers/get-template-preview-image'

import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import MissingEmailModal from './MissingEmailModal'

class SendContactCard extends React.Component {
  state = {
    isFetchingContact: false,
    isMissingEmailModalOpen: false,
    contact: this.props.contact,
    isBuilderOpen: false,
    isComposeEmailOpen: false,
    isSearchDrawerOpen: false,
    owner: this.props.user,
    emailBody: '',
    templateInstanceId: '',
    isGettingTemplateInstance: false
  }

  static getDerivedStateFromProps(props, state) {
    // For Opening Search Drawer
    if (
      props.isTriggered &&
      !state.isSearchDrawerOpen &&
      !state.isBuilderOpen
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
    if (!props.isTriggered && state.isSearchDrawerOpen && state.isBuilderOpen) {
      return {
        isSearchDrawerOpen: false
      }
    }

    return state
  }

  showBuilder = async () => {
    if (this.state.contact) {
      return this.openBuilder()
    }

    this.setState({
      isFetchingContact: true
    })

    try {
      const response = await getContact(this.props.contactId)

      this.setState(
        {
          contact: response.data,
          isFetchingContact: false
        },
        this.openBuilder
      )
    } catch (e) {
      this.setState({
        isFetchingContact: false
      })
    }
  }

  openBuilder = () => {
    // todo: removing c.summary
    if (!idx(this.state, state => state.contact.summary.email)) {
      return this.setState({
        isMissingEmailModalOpen: true
      })
    }

    this.setState({
      isBuilderOpen: true
    })
  }

  closeBuilder = () => {
    this.setState({
      isBuilderOpen: false
    })
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
        isSearchDrawerOpen: false
      },
      () => {
        this.props.handleTrigger()
        this.openBuilder()
      }
    )

  handleSaveMarketingCard = async (template, owner) => {
    this.closeBuilder()
    this.generatePreviewImage(template)

    this.setState({
      owner,
      isComposeEmailOpen: true,
      isBuilderOpen: true,
      template,
      templateScreenshot: null
    })
  }

  generatePreviewImage = async template => {
    this.setState({ isGettingTemplateInstance: true })

    const instance = await getTemplateInstances(template.id, {
      ...this.TemplateInstanceData,
      html: template.result
    })

    this.setState({
      emailBody: getTemplateInstancePreviewImage(instance),
      templateInstanceId: instance.id,
      isGettingTemplateInstance: false
    })
  }

  handleSendEmails = async values => {
    this.setState({
      isSendingEmail: true
    })

    const email = {
      from: values.fromId,
      to: values.recipients,
      subject: values.subject,
      html: this.state.template.result
    }

    if (values.template) {
      email.template = values.template
    }

    try {
      await sendContactsEmail(email)

      this.props.notify({
        status: 'success',
        message: `${
          values.recipients.length
        } emails has been sent to your contacts`
      })
    } catch (e) {
      console.log(e)
      // todo
    } finally {
      this.setState({
        isSendingEmail: false,
        isComposeEmailOpen: false,
        isBuilderOpen: false
      })
    }
  }

  closeMissingEmailDialog = () => {
    this.setState({
      isMissingEmailModalOpen: false
    })
  }

  get TemplateInstanceData() {
    return {
      contacts: this.Recipients.map(r => r.contactId)
    }
  }

  get Recipients() {
    return normalizeContact(this.state.contact, this.props.attributeDefs, {
      readOnly: true
    })
  }

  render() {
    if (hasMarketingAccess(this.props.user) === false) {
      return null
    }

    return (
      <Fragment>
        <MissingEmailModal
          isOpen={this.state.isMissingEmailModalOpen}
          contact={this.state.contact}
          onClose={this.closeMissingEmailDialog}
        />
        {this.props.contact || this.props.contactId ? (
          <ActionButton
            appearance="outline"
            onClick={this.showBuilder}
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
          isOpen={this.state.isBuilderOpen}
          onClose={this.closeBuilder}
          handleSave={this.handleSaveMarketingCard}
          mediums={this.props.mediums}
          templateData={{ user: this.props.user, contact: this.state.contact }}
          templateTypes={['Birthday']}
          defaultTemplate={this.props.selectedTemplate}
        />

        {this.state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            hasStaticBody
            disableAddNewRecipient
            isSubmitting={this.state.isSendingEmail}
            from={this.state.owner}
            recipients={this.Recipients}
            body={this.state.emailBody}
            onClose={this.toggleComposeEmail}
            onClickSend={this.handleSendEmails}
            associations={{
              template: this.state.templateInstanceId
            }}
            isSubmitDisabled={this.state.isGettingTemplateInstance}
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
  { notify, confirmation }
)(SendContactCard)
