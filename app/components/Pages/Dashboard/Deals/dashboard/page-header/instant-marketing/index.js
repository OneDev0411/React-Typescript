import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import InstantMarketing from '../../../../../../../views/components/InstantMarketing'

import ActionButton from '../../../../../../../views/components/Button/ActionButton'

import { sendContactsEmail } from '../../../../../../../models/email-compose/send-contacts-email'

import { getTemplateScreenshot } from '../../../../../../../models/instant-marketing'

import Listing from '../../../../../../../models/listings/listing'
import Compose from '../../../../../../../views/components/EmailCompose'

class DealInstantMarketing extends React.Component {
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

  generatePreviewImage = async template => {
    const imageUrl = await getTemplateScreenshot(
      template.result,
      [template.width, template.height],
      {
        width: template.width / 2,
        height: template.height / 2
      }
    )

    this.setState({
      templateScreenshot: `<img style="width: calc(100% - 2em); margin: 1em;" src="${imageUrl}" />`
    })
  }

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

    return (
      <Fragment>
        <ActionButton
          inverse
          style={this.props.buttonStyle}
          onClick={this.toggleInstantMarketingBuilder}
        >
          Promote
        </ActionButton>

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.toggleInstantMarketingBuilder}
          handleSave={this.handleSaveMarketingCard}
          templateData={{ listing }}
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

export default connect(
  null,
  { notify }
)(DealInstantMarketing)
