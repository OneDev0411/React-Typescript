import React from 'react'
import Flex from 'styled-flex-component'

import { ListingImage } from './Image'
import Address from './Address'

export function ListingInfo(props) {
  return (
    <Flex alignCenter>
      <ListingImage deal={props.deal} />

      <div style={{ padding: '0 1rem' }}>
        <Address deal={props.deal} />
      </div>
    </Flex>
  )
}
