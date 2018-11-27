import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import InstantMarketing from 'components/InstantMarketing'

import ActionButton from 'components/Button/ActionButton'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import Listing from 'models/listings/listing'
import Compose from 'components/EmailCompose'

import getTemplatePreviewImage from 'components/InstantMarketing/helpers/get-template-preview-image'

import hasMarketingAccess from 'components/InstantMarketing/helpers/has-marketing-access'

import { convertRecipientsToEmails } from 'components/InstantMarketing/Flows/utils'

import { addCRMLog } from '../../helpers/add-crm-log'
import { getTemplateTypes } from '../../helpers/get-template-types'
import { getCRMLogAssociations } from '../../helpers/get-crm-log-associations'

const initialState = {
  listing: null,
  isInstantMarketingBuilderOpen: false,
  isComposeEmailOpen: false,
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

  handleSaveMarketingCard = async template => {
    this.toggleInstantMarketingBuilder()
    this.generatePreviewImage(template)

    this.setState({
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: true,
      htmlTemplate: template.result,
      templateScreenshot: null
    })
  }

  handleSendEmails = async values => {
    this.setState({
      isSendingEmail: true
    })

    const emails = convertRecipientsToEmails(
      values.recipients,
      values.subject,
      this.state.htmlTemplate
    )

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
          templateData={{ listing, user }}
          templateTypes={getTemplateTypes(listing)}
          assets={listing && listing.gallery_image_urls}
        />

        <Compose
          isOpen={this.state.isComposeEmailOpen}
          onClose={this.toggleComposeEmail}
          recipients={this.props.recipients}
          html={this.state.templateScreenshot}
          onClickSend={this.handleSendEmails}
          isSubmitting={this.state.isSendingEmail}
        />
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
