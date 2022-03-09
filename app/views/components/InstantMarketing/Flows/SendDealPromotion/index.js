import { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import { selectActiveTeamUnsafe } from '@app/selectors/team'
import { selectUserImpersonateFirst } from '@app/selectors/user'
import ActionButton from 'components/Button/ActionButton'
import { BulkEmailComposeDrawer } from 'components/EmailCompose'
import InstantMarketing from 'components/InstantMarketing'
import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'
import getTemplateInstancePreviewImage from 'components/InstantMarketing/helpers/get-template-preview-image'
import { attachDealDataToListing } from 'components/SearchListingDrawer/helpers/attach-deal-to-listing'
import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import { createTemplateInstance } from 'models/instant-marketing/create-template-instance'
import Listing from 'models/listings/listing'
import { hasUserAccessToMarketingCenter } from 'utils/acl'

import SocialDrawer from '../../components/SocialDrawer'
import { getTemplateTypes } from '../../helpers/get-template-types'

const initialState = {
  owner: null,
  listing: null,
  isInstantMarketingBuilderOpen: false,
  isComposeEmailOpen: false,
  isSocialDrawerOpen: false,
  htmlTemplate: '',
  emailBody: '',
  templateInstance: null,
  isGettingTemplateInstance: false
}

class SendDealPromotion extends Component {
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
      emailBody: ''
    })
  }

  handleSocialSharing = template => {
    this.setState({
      htmlTemplate: template,
      isSocialDrawerOpen: true
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
      template,
      deal: this.props.deal.id
    }
  }

  onEmailSent = () => {
    this.setState(state => ({
      ...initialState,
      // If the user wants to send some new emails for current deal listing
      // we still need the listing data web#2461
      listing: state.listing
    }))
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

  closeSocialDrawer = () =>
    this.setState({
      isSocialDrawerOpen: false
    })

  getDealListing = async () => {
    const { deal } = this.props

    let listing = {}

    try {
      if (deal.listing) {
        listing = await Listing.getListing(deal.listing)
      } else {
        listing = attachDealDataToListing(deal, await getMockListing())
      }
    } catch (e) {
      console.log(e)
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

    const uniqueAssets = [...new Set(listing.gallery_image_urls)]

    return uniqueAssets.map(image => ({
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
    const { user, activeTeam } = this.props

    if (!hasUserAccessToMarketingCenter(activeTeam)) {
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
          <BulkEmailComposeDrawer
            isOpen
            hasStaticBody
            initialValues={{
              from: this.state.owner,
              to: this.props.recipients,
              body: this.state.emailBody
            }}
            getEmail={this.getEmail}
            onSent={this.onEmailSent}
            onClose={this.toggleComposeEmail}
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

function mapStateToProps(state) {
  return {
    user: selectUserImpersonateFirst(state),
    activeTeam: selectActiveTeamUnsafe(state)
  }
}

export default connect(mapStateToProps)(SendDealPromotion)
