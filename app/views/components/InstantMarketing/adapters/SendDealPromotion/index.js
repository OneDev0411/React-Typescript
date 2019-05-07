import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import Listing from 'models/listings/listing'

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

  componentDidUpdate(props) {
    if (props.deal.id !== this.props.deal.id) {
      this.getDealListing()
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

  getEmail = email => ({
    ...email,
    html: this.state.htmlTemplate.result
  })

  onEmailSent = () => {
    this.setState(state => ({
      ...initialState,
      // If the user wants to send some new emails for current deal listing
      // we still need the listing data web#2461
      listing: state.listing
    }))
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

  get types() {
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

        {this.state.isInstantMarketingBuilderOpen && (
          <InstantMarketing
            isOpen
            onClose={this.toggleInstantMarketingBuilder}
            handleSave={this.handleSaveMarketingCard}
            handleSocialSharing={this.handleSocialSharing}
            templateData={{ listing, user }}
            mediums={this.props.mediums}
            templateTypes={this.types}
            assets={this.Assets}
          />
        )}

        {this.state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            hasStaticBody
            from={this.state.owner}
            recipients={this.props.recipients}
            body={this.state.templateScreenshot}
            getEmail={this.getEmail}
            onSent={this.onEmailSent}
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

export default connect(mapStateToProps)(SendDealPromotion)
