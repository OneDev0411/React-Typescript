import React from 'react'
import Flex from 'styled-flex-component'

import LinkButton from 'components/Button/LinkButton'
import { CloseButton } from 'components/Button/CloseButton'

import { Divider } from '../../styled'

export function Menu(props) {
  return (
    <Flex alignCenter style={{ padding: '1.5em 0' }}>
      {props.deal.deal_type === 'Selling' && (
        <LinkButton
          to={`/dashboard/deals/${props.deal.id}/create-offer`}
          appearance="outline"
        >
          Add Offer
        </LinkButton>
      )}

      <Divider />
      <CloseButton isFit iconSize="large" inverse />
    </Flex>
  )
}
