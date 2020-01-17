import React from 'react'
import Flex from 'styled-flex-component'
import { withRouter } from 'react-router'

import LinkButton from 'components/Button/LinkButton'
import { CloseButton } from 'components/Button/CloseButton'
import SendEmail from 'components/SendEmailButton'

import YardSign from 'deals/components/YardSign'
import OpenHouse from 'deals/components/OpenHouse'

import { RemoveDraft } from './RemoveDraft'

import DealStatus from '../../../components/DealStatus'

import { Divider } from '../../styled'

export const Menu = withRouter(props => {
  const { deal } = props

  return (
    <Flex style={{ padding: '1.5em 0' }}>
      {deal.is_draft === true && <RemoveDraft deal={deal} />}

      {deal.deal_type === 'Selling' && (
        <OpenHouse
          deal={deal}
          style={{ marginLeft: '0.5rem' }}
          defaultOpen={(props.location.state || {}).autoBookOpenHouse}
        />
      )}

      {deal.deal_type === 'Selling' && (
        <YardSign deal={deal} style={{ marginLeft: '0.5rem' }} />
      )}

      <SendEmail deal={deal} style={{ marginLeft: '0.5rem' }} />

      {deal.deal_type === 'Selling' && !deal.has_active_offer && (
        <LinkButton
          style={{ marginLeft: '0.5rem' }}
          to={`/dashboard/deals/${deal.id}/create-offer`}
          appearance="outline"
        >
          Add Offer
        </LinkButton>
      )}

      <DealStatus
        deal={deal}
        isBackOffice={props.isBackOffice}
        style={{ marginLeft: '0.5rem' }}
      />

      <Flex style={{ paddingTop: '0.5rem' }}>
        <Divider />
        <CloseButton
          isFit
          iconSize="large"
          inverse
          backUrl="/dashboard/deals"
        />
      </Flex>
    </Flex>
  )
})
