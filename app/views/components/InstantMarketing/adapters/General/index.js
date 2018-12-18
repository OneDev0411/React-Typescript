import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import EmailCompose from 'components/EmailCompose'
import InstantMarketing from 'components/InstantMarketing'
import { getTemplatePreviewImage } from 'components/InstantMarketing/helpers/get-template-preview-image'
import ActionButton from 'components/Button/ActionButton'
import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import { convertRecipientsToEmails } from '../../helpers/convert-recipients-to-emails'

import SocialDrawer from '../../components/SocialDrawer'

class General extends React.Component {
  state = {
    isBuilderOpen: false,
    isComposeEmailOpen: false,
    isSendingEmail: false,
    isSocialDrawerOpen: false,
    htmlTemplate: '',
    templateScreenshot: null,
    owner: this.props.user
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

  handleSendEmails = async (values, form) => {
    this.setState({
      isSendingEmail: true
    })

    const emails = convertRecipientsToEmails(
      values.recipients,
      values.subject,
      this.state.htmlTemplate.result
    )

    try {
      await sendContactsEmail(emails, this.state.owner.id)

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
    this.generatePreviewImage(template)

    this.setState({
      owner,
      isComposeEmailOpen: true,
      isBuilderOpen: true,
      htmlTemplate: template,
      templateScreenshot: null
    })
  }

  generatePreviewImage = async template =>
    this.setState({
      templateScreenshot: await getTemplatePreviewImage(template)
    })

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

        <InstantMarketing
          isOpen={this.state.isBuilderOpen}
          onClose={this.closeBuilder}
          handleSave={this.handleSaveMarketingCard}
          handleSocialSharing={this.handleSocialSharing}
          templateData={{ user }}
          templateTypes={this.props.types}
          mediums={this.props.mediums}
          defaultTemplate={selectedTemplate}
        />

        {this.state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            from={this.state.owner}
            onClose={this.toggleComposeEmail}
            html={this.state.templateScreenshot}
            onClickSend={this.handleSendEmails}
            isSubmitting={this.state.isSendingEmail}
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

export default connect(
  mapStateToProps,
  { notify }
)(General)
