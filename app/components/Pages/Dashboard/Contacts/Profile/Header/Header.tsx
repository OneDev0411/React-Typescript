import React from 'react'
import { Box } from '@material-ui/core'

import Menu from './Menu/Menu'
import Catalog from './Catalog/Catalog'

interface Props {
  contact: INormalizedContact
}

export default function Header({ contact }: Props) {
  return (
    <Box px={3} pt={1}>
      <Catalog contact={contact} />
      <Menu contact={contact} />
    </Box>
  )
}
