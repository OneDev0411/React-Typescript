import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Listing from 'models/listings/listing'
import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import EmailCompose from 'components/EmailCompose'
import ActionButton from 'components/Button/ActionButton'
import InstantMarketing from 'components/InstantMarketing'

import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import { convertRecipientsToEmails } from '../../helpers/convert-recipients-to-emails'
import SocialDrawer from '../../components/SocialDrawer'
import { getTemplatePreviewImage } from '../../helpers/get-template-preview-image'
import { getTemplateTypes } from '../../helpers/get-template-types'

const initialState = {
  owner: null,
  listing: null,
  isInstantMarketingBuilderOpen: false,
  isComposeEmailOpen: false,
  isSocialDrawerOpen: false,
  htmlTemplate: '',
  templateScreenshot: null,
  socialNetworkName: ''
}

class SendDealPromotion extends React.Component {
  state = {
    ...initialState,
    owner: this.props.user
  }

  componentDidMount() {
    this.getDealListing()
  }

  toggleInstantMarketingBuilder = () =>
    this.setState(state => ({
      isInstantMarketingBuilderOpen: !state.isInstantMarketingBuilderOpen
    }))

  toggleComposeEmail = () =>
    this.setState(state => ({
      isComposeEmailOpen: !state.isComposeEmailOpen
    }))

  handleSaveMarketingCard = (template, owner) => {
    this.generatePreviewImage(template)

    this.setState({
      owner,
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: true,
      htmlTemplate: template,
      templateScreenshot: null
    })
  }

  handleSocialSharing = (template, socialNetworkName) => {
    this.setState({
      htmlTemplate: template,
      isSocialDrawerOpen: true,
      socialNetworkName
    })
  }

  handleSendEmails = async values => {
    this.setState({
      isSendingEmail: true
    })

    const emails = convertRecipientsToEmails(
      values.recipients,
      values.subject,
      this.state.htmlTemplate.result
    )

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
      this.setState(initialState)
    }
  }

  generatePreviewImage = async template => {
    const templateScreenshot = await getTemplatePreviewImage(
      template,
      this.TemplateInstanceData
    )

    this.setState({
      templateScreenshot
    })
  }

  closeSocialDrawer = () =>
    this.setState({
      isSocialDrawerOpen: false
    })

  getDealListing = async () => {
    const { deal } = this.props

    let listing = {}

    if (deal.listing) {
      try {
        listing = await Listing.getListing(deal.listing)
      } catch (e) {
        console.log(e)
      }
    }

    this.setState({
      listing
    })
  }

  get TemplateInstanceData() {
    return {
      deals: this.props.deal ? [this.props.deal.id] : []
    }
  }

  render() {
    const { listing } = this.state
    const { user } = this.props

    if (hasMarketingAccess(user) === false) {
      return null
    }

    return (
      <Fragment>
        <ActionButton
          appearance="outline"
          style={this.props.buttonStyle}
          onClick={this.toggleInstantMarketingBuilder}
        >
          {this.props.children}
        </ActionButton>

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.toggleInstantMarketingBuilder}
          handleSave={this.handleSaveMarketingCard}
          handleSocialSharing={this.handleSocialSharing}
          templateData={{ listing, user }}
          mediums={this.props.mediums}
          templateTypes={getTemplateTypes(listing)}
          assets={listing && listing.gallery_image_urls}
        />

        {this.state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            from={this.state.owner}
            onClose={this.toggleComposeEmail}
            recipients={this.Recipients}
            html={this.state.templateScreenshot}
            onClickSend={this.handleSendEmails}
            isSubmitting={this.state.isSendingEmail}
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

function mapStateToProps({ user }) {
  return {
    user
  }
}

export default connect(
  mapStateToProps,
  { notify }
)(SendDealPromotion)
