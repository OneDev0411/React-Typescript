import React from 'react'
import Flex from 'styled-flex-component'
import { Box } from '@material-ui/core'

import { Menu } from './Menu'

import { ListingInfo } from '../ListingInfo'
import { ListingProperties } from '../ListingInfo/Properties'

export function PageHeader(props) {
  return (
    <Box py={3} px={5}>
      <Flex alignCenter justifyBetween>
        <ListingInfo deal={props.deal} isBackOffice={props.isBackOffice} />
        <Menu deal={props.deal} isBackOffice={props.isBackOffice} />
      </Flex>

      <ListingProperties deal={props.deal} isBackOffice={props.isBackOffice} />
    </Box>
  )
}
