import React from 'react'
import { Box, Typography } from '@material-ui/core'

import { H4 } from 'components/Typography/headings'

interface DomainManagementTitleProps {
  title: string
}

function DomainManagementTitle({ title }: DomainManagementTitleProps) {
  return (
    <Box marginBottom={2}>
      <H4>Website Title:</H4>
      <Box paddingLeft={2} marginTop={1}>
        <Typography variant="body1" noWrap color="textSecondary">
          {title}
        </Typography>
      </Box>
    </Box>
  )
}

export default DomainManagementTitle
