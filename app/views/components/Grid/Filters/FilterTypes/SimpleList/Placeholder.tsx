import React from 'react'

import { Box, BoxProps } from '@material-ui/core'

import { useTheme } from '@material-ui/core/styles'

interface Props extends BoxProps {
  hasError?: boolean
  children: React.ReactNode
}

export const Placeholder = ({ hasError = false, ...props }: Props) => {
  const theme = useTheme()

  return (
    <Box
      {...props}
      textAlign="center"
      p="0.3rem"
      color={hasError ? theme.palette.error.main : theme.palette.grey['400']}
    />
  )
}
