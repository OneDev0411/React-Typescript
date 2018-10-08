import React from 'react'
import Flex from 'styled-flex-component'

import { Menu } from './Menu'
import { ListingInfo } from '../ListingInfo'

export function PageHeader(props) {
  return (
    <Flex justifyBetween style={{ padding: '1.5em 2.5em' }}>
      <ListingInfo deal={props.deal} />
      <Menu deal={props.deal} />
    </Flex>
  )
}
