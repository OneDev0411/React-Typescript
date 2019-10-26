import React from 'react'
import Flex from 'styled-flex-component'
import { Box } from '@material-ui/core'

import { ListingImage } from './Image'
import Address from './Address'

export function ListingInfo(props) {
  return (
    <Flex alignCenter>
      <ListingImage deal={props.deal} />

      <Box px={2}>
        <Address deal={props.deal} />
      </Box>
    </Flex>
  )
}
