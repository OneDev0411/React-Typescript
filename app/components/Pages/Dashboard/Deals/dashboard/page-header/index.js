import styled from 'styled-components'
import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import PageHeader from 'components/PageHeader'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import SendDealPromotionCard from 'components/InstantMarketing/adapters/SendDealPromotion'

import { showAttachments } from 'actions/deals'

import DealEmail from '../deal-email'

const agentNetworkValidUsers = [
  'shayan.hamidi@gmail.com',
  'snhasani+a@gmail.com',
  'emil+agent@rechat.com'
]

const Button = styled(ActionButton)`
  margin-left: 0.5em;
`

const Header = ({ user, deal, showAttachments }) => (
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

      <Button
        appearance="outline"
        onClick={() => showAttachments()}
        style={{ marginRight: '0.5rem' }}
      >
        Get Signatures
      </Button>

      {deal.listing &&
        agentNetworkValidUsers.includes(user.email) && (
          <LinkButton
            appearance="outline"
            to={`/dashboard/deals/${deal.id}/network`}
            style={{ margin: '0 0.5rem 0 0' }}
          >
            Network
          </LinkButton>
        )}

      {deal.listing && (
        <SendDealPromotionCard deal={deal}>Promote</SendDealPromotionCard>
      )}
    </PageHeader.Menu>
  </PageHeader>
)

export default connect(
  state => ({ user: state.user }),
  { showAttachments }
)(Header)
