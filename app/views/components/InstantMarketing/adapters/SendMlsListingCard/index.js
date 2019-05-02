import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import _ from 'underscore'

import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'
import { sendContactsEmail } from 'models/email-compose/send-contacts-email'
import { getTemplateInstances } from 'models/instant-marketing/get-template-instances'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { selectContact } from 'reducers/contacts/list'

import SearchListingDrawer from 'components/SearchListingDrawer'
import EmailCompose from 'components/EmailCompose'
import InstantMarketing from 'components/InstantMarketing'
import getTemplateInstancePreviewImage from 'components/InstantMarketing/helpers/get-template-preview-image'
import ActionButton from 'components/Button/ActionButton'
import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import { getMlsDrawerInitialDeals } from '../../helpers/get-mls-drawer-initial-deals'

import { generate_email_request } from '../../helpers/general'
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
    isListingsModalOpen: false,
    isEditingListings: false,
    isInstantMarketingBuilderOpen: false,
    isComposeEmailOpen: false,
    isSendingEmail: false,
    isSocialDrawerOpen: false,
    htmlTemplate: '',
    socialNetworkName: '',
    owner: this.props.user,
    emailBody: '',
    templateInstanceId: '',
    isGettingTemplateInstance: false
  }

  static getDerivedStateFromProps(props, state) {
    if (props.isTriggered != null) {
      // For Opening Search Drawer
      if (
        props.isTriggered &&
        !state.isListingsModalOpen &&
        !state.isInstantMarketingBuilderOpen
      ) {
        return {
          isListingsModalOpen: true
        }
      }

      // For just closing search drawer through its close CTA
      if (!props.isTriggered && state.isListingsModalOpen) {
        return {
          isListingsModalOpen: false
        }
      }

      // For Closing Search Drawer after selecting a contact
      if (
        !props.isTriggered &&
        state.isListingsModalOpen &&
        state.isInstantMarketingBuilderOpen
      ) {
        return {
          isListingsModalOpen: false
        }
      }
    }

    return state
  }

  handleLoadInstantMarketing = ({ regenerateTemplate }) => {
    this.regenerateTemplate = regenerateTemplate
  }

  get Recipients() {
    return this.props.selectedRows
      ? this.props.selectedRows
          .map(id => {
            const contact = selectContact(this.props.contacts, id)

            if (!contact || !contact.summary.email) {
              return null
            }

            const emails = getContactAttribute(
              contact,
              selectDefinitionByName(this.props.attributeDefs, 'email')
            )

            return {
              data_type: 'contact',
              contactId: contact.id,
              name: contact.summary.display_name,
              avatar: contact.summary.profile_image_url,
              email: contact.summary.email,
              emails: emails.map(email => email.text)
            }
          })
          .filter(recipient => recipient !== null)
      : []
  }

  handleSendEmails = async (values, form) => {
    this.setState({
      isSendingEmail: true
    })

    const email = generate_email_request(values, {
      html: this.state.htmlTemplate.result
    })

    if (values.template) {
      email.template = values.template
    }

    try {
      await sendContactsEmail(email, this.state.owner.id)

      // reset form
      if (form) {
        form.reset()
      }

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
      this.setState({
        isSendingEmail: false,
        isComposeEmailOpen: false,
        isInstantMarketingBuilderOpen: false
      })
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
    this.generatePreviewImage(template)

    this.setState({
      owner,
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: true,
      htmlTemplate: template,
      emailBody: ''
    })
  }

  handleSocialSharing = (template, socialNetworkName) => {
    this.setState({
      htmlTemplate: template,
      isSocialDrawerOpen: true,
      socialNetworkName
    })
  }

  generatePreviewImage = async template => {
    this.setState({ isGettingTemplateInstance: true })

    const instance = await getTemplateInstances(template.id, {
      ...this.TemplateInstanceData,
      html: template.result
    })

    this.setState({
      emailBody: getTemplateInstancePreviewImage(instance),
      templateInstanceId: instance.id,
      isGettingTemplateInstance: false
    })
  }

  closeMarketing = () =>
    this.setState({
      isInstantMarketingBuilderOpen: false,
      isComposeEmailOpen: false
    })

  closeSocialDrawer = () =>
    this.setState({
      isSocialDrawerOpen: false
    })

  handleEditListings = () =>
    this.setState({
      isEditingListings: true
    })

  get TemplateInstanceData() {
    return {
      listings: [this.state.listings.map(listing => listing.id)]
    }
  }

  get TemplateTypes() {
    return this.props.selectedTemplate
      ? [this.props.selectedTemplate.template_type]
      : getTemplateTypes(this.state.listings)
  }

  get IsMultiListing() {
    return (
      this.props.isMultiListing ||
      (this.props.selectedTemplate &&
        this.props.selectedTemplate.template_type === 'Listings')
    )
  }

  get DefaultList() {
    return getMlsDrawerInitialDeals(this.props.deals)
  }

  get Assets() {
    const assets = []

    this.state.listings.forEach(listing => {
      listing.gallery_image_urls.forEach(image => {
        assets.push({
          listing: listing.id,
          image
        })
      })
    })

    return assets
  }

  get TemplateData() {
    const data = { user: this.props.user }

    if (this.IsMultiListing) {
      data.listings = this.state.listings
    } else {
      data.listing = this.state.listings[0]
    }

    return data
  }

  render() {
    const { user, disabled } = this.props

    if (hasMarketingAccess(user) === false) {
      return false
    }

    return (
      <Fragment>
        {!this.props.hasExternalTrigger && (
          <ActionButton
            disabled={disabled}
            appearance="outline"
            onClick={this.openListingModal}
            size="small"
          >
            {this.props.children}
          </ActionButton>
        )}

        <SearchListingDrawer
          mockListings
          isOpen={
            this.state.isListingsModalOpen || this.state.isEditingListings
          }
          title={this.IsMultiListing ? 'Select Listings' : 'Select a Listing'}
          searchPlaceholder="Enter MLS# or an address"
          defaultList={this.DefaultList}
          defaultListTitle="Add from your deals"
          onClose={this.closeListingModal}
          onSelectListings={this.handleSelectListings}
          multipleSelection={this.IsMultiListing}
          renderAction={props => (
            <ActionButton onClick={props.onClick}>
              {this.state.isEditingListings ? (
                'Apply Changes'
              ) : (
                <Fragment>
                  Next ({_.size(props.selectedItems)} Listings Selected)
                </Fragment>
              )}
            </ActionButton>
          )}
        />

        <InstantMarketing
          onBuilderLoad={this.handleLoadInstantMarketing}
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.closeMarketing}
          handleSave={this.handleSaveMarketingCard}
          handleSocialSharing={this.handleSocialSharing}
          templateData={this.TemplateData}
          templateTypes={this.TemplateTypes}
          assets={this.Assets}
          mediums={this.props.mediums}
          defaultTemplate={this.props.selectedTemplate}
          onShowEditListings={this.handleEditListings}
        />

        {this.state.isComposeEmailOpen && (
          <EmailCompose
            isOpen
            hasStaticBody
            isSubmitting={this.state.isSendingEmail}
            from={this.state.owner}
            recipients={this.Recipients}
            body={this.state.emailBody}
            onClickSend={this.handleSendEmails}
            onClose={this.toggleComposeEmail}
            associations={{
              template: this.state.templateInstanceId
            }}
            isSubmitDisabled={this.state.isGettingTemplateInstance}
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

export default connect(
  mapStateToProps,
  { notify }
)(SendMlsListingCard)
