import React from 'react'
import { Box } from '@material-ui/core'

import Menu from './Menu/Menu'
import Catalog from './Catalog/Catalog'

interface Props {
  contact: IContact
}

export default function Header({ contact }: Props) {
  return (
    <Box p={3}>
      <Catalog contact={contact} />
      <Menu contact={contact} />
    </Box>
  )
}
