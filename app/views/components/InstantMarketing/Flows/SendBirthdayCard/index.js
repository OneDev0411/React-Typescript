import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import InstantMarketing from 'components/InstantMarketing'

import ActionButton from 'components/Button/ActionButton'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import { getTemplateScreenshot } from 'models/instant-marketing'

import Compose from 'components/EmailCompose'
import { getActiveTeamACL } from 'utils/user-teams'

import { getContact } from 'models/contacts/get-contact'

class SendBirthdayCard extends React.Component {
  state = {
    isFetchingContact: false,
    contact: null,
    isInstantMarketingBuilderOpen: false,
    isComposeEmailOpen: false
  }

  showMarketingBuilder = async () => {
    this.setState({
      isFetchingContact: true
    })

    try {
      const response = await getContact(this.props.contactId)

      this.setState({
        contact: response.data,
        isFetchingContact: false,
        isInstantMarketingBuilderOpen: true
      })
    } catch (e) {
      this.setState({
        isFetchingContact: false
      })
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

  get HasMarketingAccess() {
    const { user } = this.props
    const acl = getActiveTeamACL(user)

    return acl.includes('Marketing')
  }

  render() {
    if (!this.HasMarketingAccess) {
      return null
    }

    return (
      <Fragment>
        <ActionButton
          appearance="outline"
          size="small"
          onClick={this.showMarketingBuilder}
          disabled={this.state.isFetchingContact}
        >
          {this.props.children}
        </ActionButton>

        <InstantMarketing
          isOpen={this.state.isInstantMarketingBuilderOpen}
          onClose={this.toggleInstantMarketingBuilder}
          handleSave={this.handleSaveMarketingCard}
          templateData={{ user: this.props.user, contact: this.state.contact }}
          templateTypes={['Contact']}
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
)(SendBirthdayCard)
