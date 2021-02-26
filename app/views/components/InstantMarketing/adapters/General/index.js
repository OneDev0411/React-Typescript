import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { createTemplateInstance } from 'models/instant-marketing/create-template-instance'

import { BulkEmailComposeDrawer } from 'components/EmailCompose'
import InstantMarketing from 'components/InstantMarketing'
import getTemplateInstancePreviewImage from 'components/InstantMarketing/helpers/get-template-preview-image'
import ActionButton from 'components/Button/ActionButton'
import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'
import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'

import SocialDrawer from '../../components/SocialDrawer'

class General extends React.Component {
  state = {
    isBuilderOpen: false,
    isComposeEmailOpen: false,
    isSocialDrawerOpen: false,
    htmlTemplate: '',
    owner: this.props.user,
    emailBody: '',
    templateInstance: null,
    isGettingTemplateInstance: false
  }

  static getDerivedStateFromProps(props, state) {
    if (props.isTriggered != null) {
      // For Opening Search Drawer
      if (props.isTriggered && !state.isBuilderOpen) {
        return {
          isBuilderOpen: true
        }
      }

      // For just closing search drawer through its close CTA
      if (!props.isTriggered && state.isBuilderOpen) {
        return {
          isBuilderOpen: false
        }
      }
    }

    return state
  }

  openBuilder = () => this.setState({ isBuilderOpen: true })

  closeBuilder = () =>
    this.setState(
      {
        isBuilderOpen: false,
        isComposeEmailOpen: false
      },
      this.props.handleTrigger
    )

  toggleComposeEmail = () =>
    this.setState(state => ({
      isComposeEmailOpen: !state.isComposeEmailOpen
    }))

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

  handleSocialSharing = template => {
    this.setState({
      htmlTemplate: template,
      isSocialDrawerOpen: true
    })
  }

  closeSocialDrawer = () =>
    this.setState({
      isSocialDrawerOpen: false
    })

  handleSaveMarketingCard = async (template, owner) => {
    await this.generatePreviewImage(template)

    this.setState({
      owner,
      isComposeEmailOpen: true,
      isBuilderOpen: true,
      htmlTemplate: template,
      emailBody: ''
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

  get TemplateInstanceData() {
    return {
      listing: this.state.listing
    }
  }

  render() {
    const { user, selectedTemplate } = this.props

    if (hasMarketingAccess(user) === false) {
      return false
    }

    return (
      <Fragment>
        {!this.props.hasExternalTrigger && (
          <ActionButton
            appearance="outline"
            onClick={this.openBuilder}
            size="small"
          >
            {this.props.children}
          </ActionButton>
        )}

        {this.state.isBuilderOpen && (
          <InstantMarketing
            onClose={this.closeBuilder}
            handleSave={this.handleSaveMarketingCard}
            handleSocialSharing={this.handleSocialSharing}
            templateData={{ user }}
            templateTypes={this.props.types}
            mediums={this.props.mediums}
            defaultTemplate={selectedTemplate}
            isEdit={this.props.isEdit}
          />
        )}

        {this.state.isComposeEmailOpen && (
          <BulkEmailComposeDrawer
            isOpen
            hasStaticBody
            initialValues={{
              from: this.state.owner,
              body: this.state.emailBody
            }}
            onClose={this.toggleComposeEmail}
            onSent={this.closeBuilder}
            getEmail={this.getEmail}
            isSubmitDisabled={this.state.isGettingTemplateInstance}
          />
        )}

        {this.state.isSocialDrawerOpen && (
          <SocialDrawer
            template={this.state.htmlTemplate}
            templateInstanceData={this.TemplateInstanceData}
            onClose={this.closeSocialDrawer}
          />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user
  }
}

export default connect(mapStateToProps)(General)
