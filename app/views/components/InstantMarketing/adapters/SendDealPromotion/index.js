import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import InstantMarketing from 'components/InstantMarketing'

import ActionButton from 'components/Button/ActionButton'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import Listing from 'models/listings/listing'
import Compose from 'components/EmailCompose'

import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import SocialDrawer from '../../components/SocialDrawer'

import { getTemplatePreviewImage } from '../../helpers/get-template-preview-image'

import { addCRMLog } from '../../helpers/add-crm-log'
import { getTemplateTypes } from '../../helpers/get-template-types'
import { getCRMLogAssociations } from '../../helpers/get-crm-log-associations'

const initialState = {
  listing: null,
  socialName: null,
  isInstantMarketingBuilderOpen: false,
  isComposeEmailOpen: false,
  isSocialDrawerOpen: false,
  htmlTemplate: '',
  templateScreenshot: null
}

class SendDealPromotion extends React.Component {
  state = initialState

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

  handleSaveMarketingCard = template => {
    this.generatePreviewImage(template)

    this.setState({
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: true,
      htmlTemplate: template,
      templateScreenshot: null
    })
  }

  handleSocialSharing = (template, socialName) => {
    this.setState({
      socialName,
      htmlTemplate: template,
      isSocialDrawerOpen: true
    })
  }

  handleSendEmails = async values => {
    this.setState({
      isSendingEmail: true
    })

    const emails = values.recipients.map(recipient => ({
      to: recipient.email,
      subject: values.subject,
      html: this.state.htmlTemplate.result,
      contact: recipient.contactId
    }))

    try {
      await sendContactsEmail(emails)
      addCRMLog(this.props.user.id, values.subject, [
        ...getCRMLogAssociations(
          'contact',
          values.recipients.filter(r => r.contactId).map(r => r.contactId)
        ),
        ...getCRMLogAssociations('listing', [this.state.listing.id])
      ])

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

  generatePreviewImage = async template =>
    this.setState({
      templateScreenshot: await getTemplatePreviewImage(template)
    })

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

  render() {
    const { listing } = this.state
    const { user } = this.props

    // if (hasMarketingAccess(user) === false) {
    //   return null
    // }

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

        <Compose
          isOpen={this.state.isComposeEmailOpen}
          onClose={this.toggleComposeEmail}
          recipients={this.Recipients}
          html={this.state.templateScreenshot}
          onClickSend={this.handleSendEmails}
          isSubmitting={this.state.isSendingEmail}
        />

        {this.state.isSocialDrawerOpen && (
          <SocialDrawer
            socialName={this.state.socialName}
            template={this.state.htmlTemplate}
            templateInstanceData={{
              deals: [this.props.deal.id]
            }}
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
