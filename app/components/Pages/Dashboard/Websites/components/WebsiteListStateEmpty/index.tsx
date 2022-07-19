import React from 'react'

import { Box } from '@material-ui/core'
import { plural } from 'pluralize'

import Image from 'components/TemplatesList/EmptyStateImage'
import { H2 } from 'components/Typography/headings'

interface Props {
  title: string
}

function WebsiteListStateEmpty({ title }: Props) {
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
        <H2>You Have No {title}</H2>
      </Box>
      <Box color="#7f7f7f" textAlign="center" maxWidth="31rem">
        It looks like you haven’t created any {plural(title).toLowerCase()}. Use
        the {title} Builder to create a special one and publish on a domain.
      </Box>
    </Box>
  )
}

export default WebsiteListStateEmpty
