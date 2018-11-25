import React from 'react'
import Flex from 'styled-flex-component'

import LinkButton from 'components/Button/LinkButton'
import { CloseButton } from 'components/Button/CloseButton'

import { RemoveDraft } from './RemoveDraft'
import DealStatus from '../../../components/DealStatus'

import { Divider } from '../../styled'

export function Menu(props) {
  const { deal } = props

  return (
    <Flex style={{ padding: '1.5em 0' }}>
      {deal.is_draft === true && <RemoveDraft deal={deal} />}

      {deal.deal_type === 'Selling' && (
        <LinkButton
          style={{ marginLeft: '0.5rem' }}
          to={`/dashboard/deals/${deal.id}/create-offer`}
          appearance="outline"
        >
          Add Offer
        </LinkButton>
      )}

      {deal.is_draft === false && (
        <DealStatus
          deal={deal}
          isBackOffice={props.isBackOffice}
          style={{ marginLeft: '0.5rem' }}
        />
      )}

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
}
