import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'

import { createTemplateInstance } from 'models/instant-marketing/create-template-instance'
import { selectContact } from 'reducers/contacts/list'
import SearchListingDrawer from 'components/SearchListingDrawer'
import { BulkEmailComposeDrawer } from 'components/EmailCompose'
import InstantMarketing from 'components/InstantMarketing'
import getTemplateInstancePreviewImage from 'components/InstantMarketing/helpers/get-template-preview-image'
import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'
import { PLACEHOLDER_IMAGE_URL } from 'components/InstantMarketing/constants'

import { getActiveTeamId } from 'utils/user-teams'
import { getArrayWithFallbackAccessor } from 'utils/get-array-with-fallback-accessor'

import { getBrandListings } from 'models/listings/search/get-brand-listings'

import { getMlsDrawerInitialDeals } from '../../helpers/get-mls-drawer-initial-deals'
import { getTemplateTypes } from '../../helpers/get-template-types'
import SocialDrawer from '../../components/SocialDrawer'

const propTypes = {
  isMultiListing: PropTypes.bool
}

const defaultProps = {
  isMultiListing: false
}

class SendMlsListingCard extends React.Component {
  state = {
    listings: [],
    listingDrawerListings: [],
    isListingsModalOpen: false,
    isEditingListings: false,
    isInstantMarketingBuilderOpen: false,
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
      if (
        props.isTriggered &&
        !state.isListingsModalOpen &&
        !state.isInstantMarketingBuilderOpen &&
        !props.isEdit &&
        !props.listing &&
        !props.listings
      ) {
        return {
          isListingsModalOpen: true
        }
      }

      // For just closing search drawer through its close CTA
      if (
        !props.isTriggered &&
        state.isListingsModalOpen &&
        !props.listing &&
        !props.listings
      ) {
        return {
          isListingsModalOpen: false
        }
      }

      // For Closing Search Drawer after selecting a contact
      if (
        !props.isTriggered &&
        state.isListingsModalOpen &&
        state.isInstantMarketingBuilderOpen &&
        !props.listing &&
        !props.listings
      ) {
        return {
          isListingsModalOpen: false
        }
      }

      if (props.listings) {
        return {
          listings: props.listings,
          isInstantMarketingBuilderOpen: true
        }
      }

      if (props.listing) {
        return {
          listings: [props.listing],
          isInstantMarketingBuilderOpen: true
        }
      }
    }

    return state
  }

  async componentDidMount() {
    if (this.props.isEdit && !this.state.isInstantMarketingBuilderOpen) {
      this.setState({
        isInstantMarketingBuilderOpen: true,
        listings: this.props.selectedTemplate.listings || []
      })
    }

    if (!this.props.isEdit) {
      const brand = getActiveTeamId(this.props.user)

      try {
        const listingDrawerListings = await getBrandListings(brand)

        this.setState({ listingDrawerListings })
      } catch (e) {
        console.error(e)

        this.setState({ listingDrawerListings: [] })
      }
    }
  }

  handleLoadInstantMarketing = ({ regenerateTemplate }) => {
    this.regenerateTemplate = regenerateTemplate
  }

  /**
   *
   * @return {IDenormalizedEmailRecipientInput[]}
   */
  get Recipients() {
    /**
     *
     * @return {null|IDenormalizedEmailRecipientInput}
     */
    const getRecipientInputByContactId = id => {
      const contact = selectContact(this.props.contacts, id)

      if (!contact || !contact.email) {
        return null
      }

      return {
        recipient_type: 'Email',
        email: contact.email,
        contact: normalizeContact(contact)
      }
    }

    /**
     *
     * @return {IDenormalizedEmailRecipientDealAgentInput}
     */
    const getRecipientInputByAgent = agent => {
      return {
        recipient_type: 'Agent',
        agent
      }
    }

    if (!this.props.selectedRows || this.props.selectedRows.length === 0) {
      return []
    }

    if (typeof this.props.selectedRows[0] === 'string') {
      return this.props.selectedRows
        .map(getRecipientInputByContactId)
        .filter(recipient => recipient !== null)
    }

    return this.props.selectedRows.map(getRecipientInputByAgent)
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

  openListingModal = () => this.setState({ isListingsModalOpen: true })

  closeListingModal = () =>
    this.setState(
      { isListingsModalOpen: false, isEditingListings: false },
      this.props.handleTrigger
    )

  toggleComposeEmail = () =>
    this.setState(state => ({
      isComposeEmailOpen: !state.isComposeEmailOpen
    }))

  handleSelectListings = listings => {
    this.setState(
      {
        listings,
        isListingsModalOpen: false,
        isEditingListings: false,
        isInstantMarketingBuilderOpen: true
      },
      this.props.handleTrigger
    )

    if (typeof this.regenerateTemplate === 'function') {
      this.regenerateTemplate({ listings })
    }
  }

  handleSaveMarketingCard = async (template, owner) => {
    await this.generatePreviewImage(template)

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

  closeMarketing = () =>
    this.setState(
      {
        isInstantMarketingBuilderOpen: false,
        isComposeEmailOpen: false
      },
      this.props.handleTrigger
    )

  closeSocialDrawer = () =>
    this.setState({
      isSocialDrawerOpen: false
    })

  handleEditListings = () =>
    this.setState({
      isEditingListings: true
    })

  get TemplateInstanceData() {
    // We are offering marketing for unlisted deals by merging the deal data with
    // a base json which we are using it as base object (it is a mock `listing` object)
    // for preventing making a relation between mock object and template instance,
    // we should filter it.
    // see: `app/views/components/SearchListingDrawer/index.js`

    return {
      listings: this.state.listings
        .filter(listing => !listing.isMock)
        .map(listing => listing.id)
    }
  }

  get TemplateTypes() {
    if (this.props.types) {
      return this.props.types
    }

    return this.props.selectedTemplate
      ? [getTemplateObject(this.props.selectedTemplate).template_type]
      : getTemplateTypes(this.state.listings)
  }

  get IsMultiListing() {
    return (
      this.props.isMultiListing ||
      (this.props.selectedTemplate &&
        getTemplateObject(this.props.selectedTemplate).template_type ===
          'Listings')
    )
  }

  get DealsDefaultList() {
    return getMlsDrawerInitialDeals(this.props.deals)
  }

  get Assets() {
    const assets = []

    if (this.state.listings && Array.isArray(this.state.listings)) {
      this.state.listings.forEach(listing => {
        if (
          listing.gallery_image_urls &&
          Array.isArray(listing.gallery_image_urls)
        ) {
          const uniqueAssets = [...new Set(listing.gallery_image_urls)]

          uniqueAssets.forEach(image => {
            assets.push({
              listing: listing.id,
              image
            })
          })
        }
      })
    }

    return assets
  }

  get TemplateData() {
    const data = { user: this.props.user }

    const listings = this.state.listings.map(listing => ({
      ...listing,
      gallery_image_urls: getArrayWithFallbackAccessor(
        listing.gallery_image_urls,
        PLACEHOLDER_IMAGE_URL
      )
    }))

    if (this.IsMultiListing) {
      data.listings = listings
    } else {
      data.listing = listings[0]
    }

    return data
  }

  render() {
    const { user, disabled } = this.props

    if (hasMarketingAccess(user) === false) {
      return null
    }

    return (
      <Fragment>
        {!this.props.hasExternalTrigger && (
          <Button
            variant="outlined"
            disabled={disabled}
            onClick={this.openListingModal}
            size="small"
          >
            {this.props.children}
          </Button>
        )}

        <SearchListingDrawer
          mockListings
          allowSkip
          isOpen={
            (this.state.isListingsModalOpen || this.state.isEditingListings) &&
            !this.props.isEdit
          }
          title={this.IsMultiListing ? 'Select Listings' : 'Select a Listing'}
          searchPlaceholder="Enter MLS# or an address"
          defaultLists={[
            {
              title: 'Add from your MLS listings',
              items: this.state.listingDrawerListings
            },
            {
              title: 'Add from your deals',
              items: this.DealsDefaultList
            }
          ]}
          onClose={this.closeListingModal}
          onSelectListingsCallback={this.handleSelectListings}
          multipleSelection={this.IsMultiListing}
          renderAction={props => (
            <Button {...props.buttonProps}>
              {this.state.isEditingListings
                ? 'Apply Changes'
                : `Next (${props.selectedItemsCount} Listings Selected)`}
            </Button>
          )}
        />

        {this.state.isInstantMarketingBuilderOpen && (
          <InstantMarketing
            onBuilderLoad={this.handleLoadInstantMarketing}
            onClose={this.closeMarketing}
            handleSave={this.handleSaveMarketingCard}
            handleSocialSharing={this.handleSocialSharing}
            templateData={this.TemplateData}
            templateTypes={this.TemplateTypes}
            assets={this.Assets}
            mediums={this.props.mediums}
            defaultTemplate={this.props.selectedTemplate}
            onShowEditListings={this.handleEditListings}
            isEdit={this.props.isEdit}
            hideTemplatesColumn={this.props.hideTemplatesColumn}
            isTemplatesColumnHiddenDefault={
              this.props.isTemplatesColumnHiddenDefault
            }
          />
        )}

        {this.state.isComposeEmailOpen && (
          <BulkEmailComposeDrawer
            isOpen
            hasStaticBody
            initialValues={{
              from: this.state.owner,
              to: this.Recipients,
              body: this.state.emailBody
            }}
            getEmail={this.getEmail}
            onClose={this.toggleComposeEmail}
            onSent={this.closeMarketing}
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

SendMlsListingCard.propTypes = propTypes
SendMlsListingCard.defaultProps = defaultProps

function mapStateToProps({ contacts, deals, user }) {
  return {
    contacts: contacts.list,
    deals: deals.list,
    attributeDefs: contacts.attributeDefs,
    user
  }
}

export default connect(mapStateToProps)(SendMlsListingCard)
