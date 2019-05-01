import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import idx from 'idx'

import { normalizeContact } from 'models/email-compose/helpers/normalize-contact'

import InstantMarketing from 'components/InstantMarketing'
import ActionButton from 'components/Button/ActionButton'

import { confirmation } from 'actions/confirmation'

import EmailCompose from 'components/EmailCompose'

import { SearchContactDrawer } from 'components/SearchContactDrawer'

import { getContact } from 'models/contacts/get-contact'

import { getTemplatePreviewImage } from 'components/InstantMarketing/helpers/get-template-preview-image'

import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import SocialDrawer from '../../components/SocialDrawer'

import MissingEmailModal from './MissingEmailModal'

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
    owner: this.props.user
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
      isBuilderOpen: false,
      isComposeEmailOpen: false
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
      htmlTemplate: template.result,
      templateScreenshot: null
    })
  }

  generatePreviewImage = async template =>
    this.setState({
      templateScreenshot: await getTemplatePreviewImage(
        template,
        this.TemplateInstanceData
      )
    })

  getEmail = email => ({
    ...email,
    html: this.state.htmlTemplate
  })

  closeMissingEmailDialog = () => {
    this.setState({
      isMissingEmailModalOpen: false,
      isComposeEmailOpen: false
    })
  }

  handleSocialSharing = (template, socialNetworkName) => {
    this.setState({
      htmlTemplate: template,
      isSocialDrawerOpen: true,
      socialNetworkName
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

  closeSocialDrawer = () =>
    this.setState({
      isSocialDrawerOpen: false
    })

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
          handleSocialSharing={this.handleSocialSharing}
        />

        {this.state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            hasStaticBody
            disableAddNewRecipient
            from={this.state.owner}
            recipients={this.Recipients}
            body={this.state.templateScreenshot}
            onSent={this.closeBuilder}
            onClose={this.toggleComposeEmail}
            getEmail={this.getEmail}
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
