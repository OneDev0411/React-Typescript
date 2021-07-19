import React, { ReactNode } from 'react'
import { Typography, Box } from '@material-ui/core'

interface ShowingPropertyFormSectionProps {
  marginTop?: number
  marginBottom?: number
  title: string
  children: ReactNode
}

function ShowingPropertyFormSection({
  marginTop = 0,
  marginBottom = 0,
  title,
  children
}: ShowingPropertyFormSectionProps) {
  return (
    <Box mt={marginTop} mb={marginBottom}>
      <Typography variant="h6">{title}</Typography>
      <Box mt={2}>{children}</Box>
    </Box>
  )
}

export default ShowingPropertyFormSection
