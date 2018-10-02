import React from 'react'
import Flex from 'styled-flex-component'

import { ListingImage } from './Image'
import { H1 } from 'components/Typography/headings'
import LinkButton from 'components/Button/LinkButton'

import { Divider } from '../styled'

import Deal from 'models/Deal'

function getTitle(deal) {
  return Deal.get.field(deal, 'street_address')
}

function getAddress(deal) {
  const city = Deal.get.field(deal, 'city')
  const state = Deal.get.field(deal, 'state')
  const zipcode = Deal.get.field(deal, 'postal_code')

  return `${city}, ${state} ${zipcode}`
}

export function ListingInfo(props) {
  return (
    <Flex alignCenter>
      <ListingImage deal={props.deal} />

      <Flex column style={{ padding: '0.5em 1.5em' }}>
        <H1 style={{ lineHeight: 1.5 }}>{getTitle(props.deal)}</H1>
        <Flex alignCenter>
          {getAddress(props.deal)}

          <Divider />

          <LinkButton style={{ padding: 0 }}>Add MLS# number</LinkButton>
        </Flex>
      </Flex>
    </Flex>
  )
}
