import { Component, Fragment } from 'react'

import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectActiveBrandIdUnsafe } from '@app/selectors/brand'
import { selectActiveTeamUnsafe } from '@app/selectors/team'
import { selectUserImpersonateFirst } from '@app/selectors/user'
import { BulkEmailComposeDrawer } from 'components/EmailCompose'
import InstantMarketing from 'components/InstantMarketing'
import { PLACEHOLDER_IMAGE_URL } from 'components/InstantMarketing/constants'
import { getHipPocketTemplateImagesUploader } from 'components/InstantMarketing/helpers/get-hip-pocket-template-image-uploader'
import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'
import getTemplateInstancePreviewImage from 'components/InstantMarketing/helpers/get-template-preview-image'
import SearchListingDrawer from 'components/SearchListingDrawer'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { createTemplateInstance } from 'models/instant-marketing/create-template-instance'
import { getBrandListings } from 'models/listings/search/get-brand-listings'
import { selectContact } from 'reducers/contacts/list'
import { hasUserAccessToMarketingCenter } from 'utils/acl'
import { getArrayWithFallbackAccessor } from 'utils/get-array-with-fallback-accessor'

import SocialDrawer from '../../components/SocialDrawer'
import { getMlsDrawerInitialDeals } from '../../helpers/get-mls-drawer-initial-deals'
import { getTemplateTypes } from '../../helpers/get-template-types'

const propTypes = {
  isMultiListing: PropTypes.bool,
  hasExternalTrigger: PropTypes.bool,
  isTriggered: PropTypes.bool,
  isTemplatesColumnHiddenDefault: PropTypes.bool,
  mediums: PropTypes.string,
  types: PropTypes.arrayOf(PropTypes.string),
  listing: PropTypes.object,
  selectedTemplate: PropTypes.object,
  selectedRows: PropTypes.array,
  handleTrigger: PropTypes.func,
  disabled: PropTypes.bool,
  buttonRenderer: PropTypes.func,
  listings: PropTypes.arrayOf(PropTypes.object),
  tags: PropTypes.arrayOf(PropTypes.string)
}

const defaultProps = {
  isMultiListing: false
}

class SendMlsListingCard extends Component {
  state = {
    listings: [],
    listingDrawerListings: [],
    isListingsModalOpen: false,
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
      try {
        const listingDrawerListings = await getBrandListings(
          this.props.activeBrandId
        )

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
    this.setState({ isListingsModalOpen: false }, this.props.handleTrigger)

  toggleComposeEmail = () =>
    this.setState(state => ({
      isComposeEmailOpen: !state.isComposeEmailOpen
    }))

  handleSelectListings = listings => {
    this.setState(
      {
        listings,
        isListingsModalOpen: false,
        isInstantMarketingBuilderOpen: true
      },
      this.props.handleTrigger
    )

    if (typeof this.regenerateTemplate === 'function') {
      this.regenerateTemplate({ listings })
    }
  }

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

  closeSocialDrawerAndBuilder = () =>
    this.setState(
      {
        isInstantMarketingBuilderOpen: false,
        isSocialDrawerOpen: false
      },
      this.props.handleTrigger
    )

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
    const { activeTeam, disabled } = this.props

    if (!hasUserAccessToMarketingCenter(activeTeam)) {
      return null
    }

    return (
      <Fragment>
        {!this.props.hasExternalTrigger && !this.props.buttonRenderer && (
          <Button
            variant="outlined"
            disabled={disabled}
            onClick={this.openListingModal}
            size="small"
          >
            {this.props.children}
          </Button>
        )}
        {this.props.buttonRenderer &&
          this.props.buttonRenderer({
            onClick: this.openListingModal,
            disabled
          })}

        <SearchListingDrawer
          allowHipPocket
          onHipPocketImageUpload={
            this.props.selectedTemplate
              ? getHipPocketTemplateImagesUploader(
                  this.props.selectedTemplate.template.id
                )
              : undefined
          }
          isOpen={this.state.isListingsModalOpen && !this.props.isEdit}
          withMlsDisclaimer
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
            <Button
              variant="contained"
              color="secondary"
              {...props.buttonProps}
            >
              {`Next (${props.selectedItemsCount} Listings Selected)`}
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
            tags={this.props.tags}
          />
        )}

        {this.state.isSocialDrawerOpen && (
          <SocialDrawer
            template={this.state.htmlTemplate}
            templateInstanceData={this.TemplateInstanceData}
            onClose={this.closeSocialDrawer}
            onPostScheduled={this.closeSocialDrawerAndBuilder}
            onPostSent={this.closeSocialDrawerAndBuilder}
          />
        )}
      </Fragment>
    )
  }
}

SendMlsListingCard.propTypes = propTypes
SendMlsListingCard.defaultProps = defaultProps

function mapStateToProps({ contacts, deals, ...state }) {
  return {
    contacts: contacts.list,
    deals: deals.list,
    attributeDefs: contacts.attributeDefs,
    user: selectUserImpersonateFirst(state),
    activeTeam: selectActiveTeamUnsafe(state),
    activeBrandId: selectActiveBrandIdUnsafe(state)
  }
}

export default connect(mapStateToProps)(SendMlsListingCard)
