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

class SendDealPromotion extends React.Component {
  state = {
    listing: null,
    isInstantMarketingBuilderOpen: false,
    isComposeEmailOpen: false,
    htmlTemplate: '',
    templateScreenshot: null
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

  handleSaveMarketingCard = async template => {
    this.toggleInstantMarketingBuilder()
    this.generatePreviewImage(template)

    this.setState({
      isComposeEmailOpen: true,
      isInstantMarketingBuilderOpen: false,
      htmlTemplate: template.result,
      templateScreenshot: null
    })
  }

  handleSendEmails = async values => {
    this.setState({
      isSendingEmail: true
    })

    const emails = values.recipients.map(recipient => ({
      to: recipient.email,
      subject: values.subject,
      html: this.state.htmlTemplate,
      contact: recipient.contactId
    }))

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
      this.setState({
        isSendingEmail: false,
        isComposeEmailOpen: false
      })
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
          templateTypes={['Listing']}
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
