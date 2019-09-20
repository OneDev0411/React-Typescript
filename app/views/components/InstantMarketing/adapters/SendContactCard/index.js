import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import idx from 'idx'
import { Button } from '@material-ui/core'

import { getContact } from 'models/contacts/get-contact'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { getTemplateInstances } from 'models/instant-marketing/get-template-instances'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import { confirmation } from 'actions/confirmation'

import MissingEmailModal from 'components/MissingEmailModal'
import InstantMarketing from 'components/InstantMarketing'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { SearchContactDrawer } from 'components/SearchContactDrawer'
import getTemplateInstancePreviewImage from 'components/InstantMarketing/helpers/get-template-preview-image'
import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import SocialDrawer from '../../components/SocialDrawer'

class SendContactCard extends React.Component {
  state = {
    isFetchingContact: false,
    isMissingEmailModalOpen: false,
    contact: this.props.contact,
    isBuilderOpen: false,
    isComposeEmailOpen: false,
    isSearchDrawerOpen: false,
    isSocialDrawerOpen: false,
    socialNetworkName: '',
    owner: this.props.user,
    emailBody: '',
    templateInstance: null,
    isGettingTemplateInstance: false
  }

  static getDerivedStateFromProps(props, state) {
    // For Opening Search Drawer
    if (
      props.isTriggered &&
      !state.isSearchDrawerOpen &&
      !state.isBuilderOpen &&
      !props.isEdit
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

    // For controling the contact state from the parent component
    if (
      (!state.contact && props.contact) ||
      (state.contact &&
        props.contact &&
        props.contact.updated_at > state.contact.updated_at)
    ) {
      return {
        contact: props.contact
      }
    }

    return state
  }

  componentDidMount() {
    if (this.props.isEdit && !this.state.isBuilderOpen) {
      this.setState({ isBuilderOpen: true })
    }
  }

  showBuilder = async (contactId = this.props.contactId) => {
    if (this.state.contact) {
      return this.openBuilder()
    }

    this.setState({
      isFetchingContact: true
    })

    try {
      const response = await getContact(contactId)

      this.setState(
        {
          contact: normalizeContact(response.data),
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
    if (!idx(this.state, state => state.contact.email)) {
      return this.setState({
        isMissingEmailModalOpen: true
      })
    }

    this.setState({
      isBuilderOpen: true
    })
  }

  closeBuilder = () => {
    this.setState(
      {
        isBuilderOpen: false,
        isComposeEmailOpen: false
      },
      this.props.handleTrigger
    )
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
      templateInstance: instance,
      isGettingTemplateInstance: false
    })
  }

  getEmail = email => {
    const { templateInstance } = this.state

    if (templateInstance == null) {
      throw new Error(`Template instance is ${typeof templateInstance}!`)
    }

    const { html, id: template } = templateInstance

    return {
      ...email,
      html,
      template
    }
  }

  closeMissingEmailDialog = () => {
    this.setState({
      isMissingEmailModalOpen: false,
      isComposeEmailOpen: false
    })
  }

  handleSocialSharing = (template, socialNetworkName) =>
    this.setState({
      htmlTemplate: template,
      isSocialDrawerOpen: true,
      socialNetworkName
    })

  get TemplateInstanceData() {
    return {
      contacts: this.Recipients.map(r => r.contact.id)
    }
  }

  get Recipients() {
    return normalizeContactsForEmailCompose([this.state.contact])
  }

  closeSocialDrawer = () =>
    this.setState({
      isSocialDrawerOpen: false
    })

  getRef = () => {
    const { actionRef } = this.props

    if (!actionRef) {
      return actionRef
    }

    actionRef.current = {
      showBuilder: (contact = null, contactId = null) => {
        this.setState({ contact }, () => this.showBuilder(contactId))
      }
    }
  }

  render() {
    if (hasMarketingAccess(this.props.user) === false) {
      return null
    }

    return (
      <Fragment>
        <MissingEmailModal
          isOpen={this.state.isMissingEmailModalOpen}
          contactId={this.state.contact && this.state.contact.id}
          onClose={this.closeMissingEmailDialog}
          action="send a card"
        />

        {this.props.contact || this.props.contactId ? (
          <Button
            color="secondary"
            variant="outlined"
            onClick={this.showBuilder}
            disabled={this.state.isFetchingContact}
            {...this.props.buttonProps}
          >
            {this.props.children}
          </Button>
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
          handleSocialSharing={this.handleSocialSharing}
          isEdit={this.props.isEdit}
        />

        <SingleEmailComposeDrawer
          isOpen={this.state.isComposeEmailOpen}
          hasStaticBody
          disableAddNewRecipient
          initialValues={{
            from: this.state.owner,
            to: this.Recipients,
            body: this.state.emailBody
          }}
          onSent={this.closeBuilder}
          onClose={this.toggleComposeEmail}
          getEmail={this.getEmail}
          isSubmitDisabled={this.state.isGettingTemplateInstance}
        />

        {this.state.isSocialDrawerOpen && (
          <SocialDrawer
            template={this.state.htmlTemplate}
            templateInstanceData={this.TemplateInstanceData}
            socialNetworkName={this.state.socialNetworkName}
            onClose={this.closeSocialDrawer}
          />
        )}

        {this.state.isSocialDrawerOpen && (
          <SocialDrawer
            template={this.state.htmlTemplate}
            templateInstanceData={this.TemplateInstanceData}
            socialNetworkName={this.state.socialNetworkName}
            onClose={this.closeSocialDrawer}
          />
        )}

        <div ref={this.getRef} />
      </Fragment>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user
  }
}

const ConnectedAction = connect(
  mapStateToProps,
  { notify, confirmation }
)(SendContactCard)

// eslint-disable-next-line react/no-multi-comp
export default React.forwardRef((props, ref) => (
  <ConnectedAction {...props} actionRef={ref} />
))
