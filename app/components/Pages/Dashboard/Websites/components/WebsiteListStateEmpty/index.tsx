import React from 'react'

import { Box } from '@material-ui/core'

import { H2 } from 'components/Typography/headings'
import Image from 'components/TemplatesList/EmptyStateImage'

function WebsiteListStateEmpty() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box marginBottom={1.5}>
        <Image />
      </Box>
      <Box marginBottom={2}>
        <H2>You Have No Websites</H2>
      </Box>
      <Box color="#7f7f7f" textAlign="center" maxWidth="27rem">
        It looks like you haven’t created any website. Use the Website Builder
        to create a special one and publish on a domain.
      </Box>
    </Box>
  )
}

export default WebsiteListStateEmpty
