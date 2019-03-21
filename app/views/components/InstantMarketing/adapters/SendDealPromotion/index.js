import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Listing from 'models/listings/listing'
import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import EmailCompose from 'components/EmailCompose'
import ActionButton from 'components/Button/ActionButton'
import InstantMarketing from 'components/InstantMarketing'

import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

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

    const email = {
      from: values.fromId,
      to: values.recipients,
      subject: values.subject,
      html: this.state.htmlTemplate.result
    }

    try {
      await sendContactsEmail(email, this.state.owner.id)

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

  get Assets() {
    const { listing } = this.state

    if (!listing) {
      return []
    }

    return listing.gallery_image_urls.map(image => ({
      image
    }))
  }

  getTypes = () => {
    if (Array.isArray(this.props.types)) {
      return this.props.types
    }

    return getTemplateTypes(this.state.listing)
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
          templateTypes={this.getTypes()}
          assets={this.Assets}
        />

        {this.state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            hasStaticBody
            isSubmitting={this.state.isSendingEmail}
            from={this.state.owner}
            recipients={this.props.recipients}
            body={this.state.templateScreenshot}
            onClickSend={this.handleSendEmails}
            onClose={this.toggleComposeEmail}
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
