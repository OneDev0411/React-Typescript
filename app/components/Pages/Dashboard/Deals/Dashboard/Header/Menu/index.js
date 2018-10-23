import React from 'react'
import Flex from 'styled-flex-component'

import LinkButton from 'components/Button/LinkButton'
import { CloseButton } from 'components/Button/CloseButton'

import { RemoveDraft } from './RemoveDraft'

import { Divider } from '../../styled'

export function Menu(props) {
  return (
    <Flex style={{ padding: '1.5em 0' }}>
      {props.deal.is_draft && <RemoveDraft deal={props.deal} />}

      {props.deal.deal_type === 'Selling' && (
        <LinkButton
          style={{ marginLeft: '0.5rem' }}
          to={`/dashboard/deals/${props.deal.id}/create-offer`}
          appearance="outline"
        >
          Add Offer
        </LinkButton>
      )}

      <Flex style={{ paddingTop: '0.5rem' }}>
        <Divider />
        <CloseButton isFit iconSize="large" inverse />
      </Flex>
    </Flex>
  )
}
