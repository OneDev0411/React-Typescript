import { Component } from 'react'

import { Button } from '@material-ui/core'
import idx from 'idx'
import { connect } from 'react-redux'

import { selectActiveTeamUnsafe } from '@app/selectors/team'
import { selectUserImpersonateFirst } from '@app/selectors/user'
import { confirmation } from 'actions/confirmation'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import InstantMarketing from 'components/InstantMarketing'
import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'
import getTemplateInstancePreviewImage from 'components/InstantMarketing/helpers/get-template-preview-image'
import MissingEmailModal from 'components/MissingEmailModal'
import { addNotification as notify } from 'components/notification'
import { SearchContactDrawer } from 'components/SearchContactDrawer'
import { getContact } from 'models/contacts/get-contact'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'
import { createTemplateInstance } from 'models/instant-marketing/create-template-instance'
import { hasUserAccessToMarketingCenter } from 'utils/acl'

import SocialDrawer from '../../components/SocialDrawer'

class SendContactCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isFetchingContact: false,
      isMissingEmailModalOpen: false,
      contact: this.props.contact,
      isBuilderOpen: false,
      isComposeEmailOpen: false,
      isSearchDrawerOpen: false,
      isSocialDrawerOpen: false,
      owner: this.props.user,
      emailBody: '',
      templateInstance: null,
      isGettingTemplateInstance: false
    }
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

    if (props.contact && props.isBuilderOpen) {
      return {
        contact: props.contact,
        isBuilderOpen: true
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

  handleSaveMarketingCard = (template, owner) => {
    this.generatePreviewImage(template)

    this.setState({
      owner,
      isComposeEmailOpen: true,
      isBuilderOpen: true,
      template,
      templateScreenshot: null
    })
  }

  generatePreviewImage = async brandTemplate => {
    this.setState({ isGettingTemplateInstance: true })

    const template = getTemplateObject(brandTemplate)

    const instance = await createTemplateInstance(template.id, {
      ...this.TemplateInstanceData,
      html: brandTemplate.result
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

  handleSocialSharing = template =>
    this.setState({
      htmlTemplate: template,
      isSocialDrawerOpen: true
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

  renderButton = () => {
    const { buttonRenderrer } = this.props

    const renderProps = {
      onClick: this.showBuilder,
      disabled: this.state.isFetchingContact
    }

    if (buttonRenderrer) {
      return buttonRenderrer(renderProps)
    }

    return (
      <Button
        variant="outlined"
        onClick={this.showBuilder}
        disabled={this.state.isFetchingContact}
        {...this.props.buttonProps}
      >
        {this.props.children}
      </Button>
    )
  }

  getTemplateTypes = () => {
    if (this.props.types) {
      return this.props.types
    }

    if (this.props.selectedTemplate) {
      return this.props.selectedTemplate.template.template_type
    }

    // Not sure why we have it here! I just refactored it and fixed and another bug
    // See: https://gitlab.com/rechat/web/-/issues/4999
    return ['Birthday']
  }

  render() {
    if (!hasUserAccessToMarketingCenter(this.props.activeTeam)) {
      return null
    }

    return (
      <>
        <MissingEmailModal
          isOpen={this.state.isMissingEmailModalOpen}
          contactId={this.state.contact && this.state.contact.id}
          onClose={this.closeMissingEmailDialog}
          action="send a card"
        />

        {this.props.contact || this.props.contactId ? (
          this.renderButton()
        ) : (
          <SearchContactDrawer
            title="Select a Contact"
            isOpen={this.state.isSearchDrawerOpen}
            onSelect={this.handleSelectedContact}
            onClose={this.closeSearchDrawer}
          />
        )}

        {this.state.isBuilderOpen && (
          <InstantMarketing
            onClose={this.closeBuilder}
            handleSave={this.handleSaveMarketingCard}
            mediums={this.props.mediums}
            templateData={{
              user: this.props.user,
              contact: this.state.contact
            }}
            templateTypes={this.getTemplateTypes()}
            defaultTemplate={this.props.selectedTemplate}
            handleSocialSharing={this.handleSocialSharing}
            isEdit={this.props.isEdit}
            hideTemplatesColumn={this.props.hideTemplatesColumn}
            isTemplatesColumnHiddenDefault={
              this.props.isTemplatesColumnHiddenDefault
            }
          />
        )}

        <SingleEmailComposeDrawer
          isOpen={this.state.isComposeEmailOpen}
          hasStaticBody
          // I removed it because we need to be able to adding
          // contact to email compose when it's on editmode.
          // disableAddNewRecipient
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
            onClose={this.closeSocialDrawer}
            onPostScheduled={this.closeBuilder}
            onPostSent={this.closeBuilder}
          />
        )}
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: selectUserImpersonateFirst(state),
    activeTeam: selectActiveTeamUnsafe(state)
  }
}

export default connect(mapStateToProps, { notify, confirmation })(
  SendContactCard
)
