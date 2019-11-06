import * as React from 'react'
import { ReactNode } from 'react'
import { Box, Typography } from '@material-ui/core'

interface Props {
  description: ReactNode
  actions: ReactNode
}

export function FooterBottomDrawerZeroState(props: Props) {
  return (
    <Box
      p={8}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="body1" align="center" color="textSecondary">
        {props.description}
      </Typography>
      <Box mt={2}>{props.actions}</Box>
    </Box>
  )
}
