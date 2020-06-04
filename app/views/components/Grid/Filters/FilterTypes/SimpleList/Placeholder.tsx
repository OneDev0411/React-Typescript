import React from 'react'

import { Box } from '@material-ui/core'

import { useTheme } from '@material-ui/core/styles'

interface Props {
  hasError: boolean
}

export const Placeholder = ({ hasError }: Props) => {
  const theme = useTheme()

  return (
    <Box
      textAlign="center"
      p="0.3rem"
      color={hasError ? theme.palette.error.main : theme.palette.grey['400']}
    />
  )
}
