import React from 'react'
import { Box } from '@material-ui/core'

import CreateNewOpenHouse from './CreateNewOpenHouse'

export default function EmptyState(props: {
  onOpenDrawer: (item: IDeal | ICompactListing) => void
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt="20vh"
    >
      <img src="/static/images/contacts/zero-state.svg" alt="Houston" />
      <h2>Houston, we have no open house!</h2>
      <p>Open house is a key point in the business. Start a new event now.</p>
      <CreateNewOpenHouse onOpenDrawer={props.onOpenDrawer} />
    </Box>
  )
}
