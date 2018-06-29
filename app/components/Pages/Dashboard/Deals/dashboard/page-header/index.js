import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { showAttachments } from '../../../../../../store_actions/deals'
import DealEmail from '../../dashboard/deal-email'
import PageHeader from '../../../../../../views/components/PageHeader'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

class Header extends React.Component {
  render() {
    const { deal } = this.props
    const buttonStyle = {
      marginLeft: '10px',
      padding: '0.70em 1.5em'
    }

    return (
      <PageHeader title="Deals" backUrl="/dashboard/deals">
        <PageHeader.Menu>
          <DealEmail dealEmail={deal.email} />
          {deal.deal_type === 'Selling' && (
            <ActionButton
              style={buttonStyle}
              onClick={() =>
                browserHistory.push(`/dashboard/deals/${deal.id}/create-offer`)
              }
            >
              Add New Offer
            </ActionButton>
          )}

          <ActionButton
            inverse
            style={buttonStyle}
            onClick={() =>
              browserHistory.push(`/dashboard/deals/${deal.id}/files`)
            }
          >
            View & Upload Files
          </ActionButton>

          <ActionButton
            inverse
            style={buttonStyle}
            onClick={() => this.props.showAttachments()}
          >
            Get Signatures
          </ActionButton>
        </PageHeader.Menu>
      </PageHeader>
    )
  }
}

export default connect(
  ({ deals }) => ({
    isBackOffice: deals.backoffice
  }),
  { showAttachments }
)(Header)
