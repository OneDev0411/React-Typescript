import React from 'react'
import Flex from 'styled-flex-component'

import { Menu } from './Menu'

import { ListingInfo } from '../ListingInfo'
import { ListingProperties } from '../ListingInfo/Properties'

export function PageHeader(props) {
  return (
    <div style={{ padding: '1.5em 2.5em' }}>
      <Flex alignCenter justifyBetween>
        <ListingInfo deal={props.deal} isBackOffice={props.isBackOffice} />
        <Menu deal={props.deal} isBackOffice={props.isBackOffice} />
      </Flex>

      <ListingProperties deal={props.deal} isBackOffice={props.isBackOffice} />
    </div>
  )
}
