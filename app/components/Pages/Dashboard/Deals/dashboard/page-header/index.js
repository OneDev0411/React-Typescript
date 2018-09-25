import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { showAttachments } from '../../../../../../store_actions/deals'

import DealEmail from '../../dashboard/deal-email'

import PageHeader from 'components/PageHeader'
import ActionButton from 'components/Button/ActionButton'
import SendDealPromotionCard from '../../../../../../views/components/InstantMarketing/Flows/SendDealPromotion'

const Button = ActionButton.extend`
  margin-left: 0.5em;
`

const Header = ({ deal, showAttachments }) => (
  <PageHeader title="Deals" backUrl="/dashboard/deals">
    <PageHeader.Menu>
      <DealEmail dealEmail={deal.email} />
      {deal.deal_type === 'Selling' && (
        <Button
          onClick={() =>
            browserHistory.push(`/dashboard/deals/${deal.id}/create-offer`)
          }
        >
          Add New Offer
        </Button>
      )}

      <Button
        appearance="outline"
        onClick={() => browserHistory.push(`/dashboard/deals/${deal.id}/files`)}
      >
        View & Upload Files
      </Button>

      <Button appearance="outline" onClick={showAttachments}>
        Get Signatures
      </Button>

      <SendDealPromotionCard deal={deal} buttonStyle={{ marginLeft: '0.5em' }}>
        Promote
      </SendDealPromotionCard>
    </PageHeader.Menu>
  </PageHeader>
)

export default connect(
  null,
  { showAttachments }
)(Header)
