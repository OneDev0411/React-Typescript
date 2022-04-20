import React, { Fragment } from 'react'

import { connect } from 'react-redux'

import ActionButton from 'components/Button/ActionButton'
import { BulkEmailComposeDrawer } from 'components/EmailCompose'
import { hasUserAccessToMarketingCenter } from 'utils/acl'

import SocialDrawer from '../../components/SocialDrawer'
import getTemplateInstancePreviewImage from '../../helpers/get-template-preview-image'

import { getMedium } from './helpers'

class ShareInstance extends React.Component {
  state = {
    isComposeDrawerOpen: false,
    isSocialDrawerOpen: false
  }

  static getDerivedStateFromProps(props, state) {
    const medium = getMedium(props.instance)

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

  /**
   *
   * @param email {IEmailCampaignInput}
   * @return IEmailCampaignInput
   */
  getEmail = email => ({
    ...email,
    html: this.props.instance.html,
    template: this.props.instance.id
  })

  closeDrawerAndBuilder = () => {
    this.setState(
      {
        isComposeDrawerOpen: false
      },
      this.props.handleTrigger
    )
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

    if (!hasUserAccessToMarketingCenter(props.activeTeam)) {
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
          <BulkEmailComposeDrawer
            isOpen
            hasStaticBody
            initialValues={{
              body: getTemplateInstancePreviewImage(props.instance)
            }}
            getEmail={this.getEmail}
            onSent={this.closeDrawerAndBuilder}
            onClose={this.toggleComposeEmail}
          />
        )}

        {state.isSocialDrawerOpen && (
          <SocialDrawer
            instance={props.instance}
            onClose={this.closeSocialDrawer}
            onPostScheduled={this.closeDrawerAndBuilder}
            onPostSent={this.closeDrawerAndBuilder}
          />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps({ activeTeam = null, contacts }) {
  return {
    activeTeam,
    attributeDefs: contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(ShareInstance)
